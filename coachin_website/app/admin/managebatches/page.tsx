"use client"
import React, { useEffect, useState } from "react";

interface Batch {
  _id: string;
  batchName: string;
  batchSize: string;
  startingDate: string;
  timing: string;
}

type BatchForm = Omit<Batch, "_id">;

const emptyForm: BatchForm = {
  batchName: "",
  batchSize: "",
  startingDate: "",
  timing: "",
};

export default function ManageBatchesPage() {
  const [batches, setBatches] = useState([] as Batch[]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null as string | null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null as Batch | null);
  const [form, setForm] = useState(emptyForm as BatchForm);
  const [error, setError] = useState("");
  const [batchToDelete, setBatchToDelete] = useState(null as string | null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/batches/get-all");
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingBatch(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setForm({
      batchName: batch.batchName,
      batchSize: batch.batchSize,
      startingDate: batch.startingDate ? new Date(batch.startingDate).toISOString().split('T')[0] : "",
      timing: batch.timing,
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBatch(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Modal Helpers for native HTML dialogs
  const openDialog = (id: string) => {
    (document.getElementById(id) as HTMLDialogElement)?.showModal();
  };
  const closeDialog = (id: string) => {
    (document.getElementById(id) as HTMLDialogElement)?.close();
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    openDialog("success_modal");
  };

  const handleSubmit = async () => {
    if (!form.batchName || !form.timing || !form.startingDate || !form.batchSize) {
      setError("All fields are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const url = editingBatch
        ? `/api/admin/batches/update/${editingBatch._id}`
        : "/api/admin/batches/post";
      const method = editingBatch ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      await fetchBatches();
      closeModal();
      showSuccess(editingBatch ? "Batch updated successfully!" : "Batch created successfully!");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setBatchToDelete(id);
    openDialog("delete_confirm_modal");
  };

  const executeDelete = async () => {
    if (!batchToDelete) return;
    setDeletingId(batchToDelete);
    try {
      const res = await fetch(`/api/admin/batches/delete/${batchToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b._id !== batchToDelete));
        closeDialog("delete_confirm_modal");
        showSuccess("Batch deleted successfully!");
      } else {
        alert("Failed to delete.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
      setBatchToDelete(null);
      closeDialog("delete_confirm_modal");
    }
  };

  return (
    <div className="space-y-5 p-1">

      {/* Header */}
      <div className="flex items-center justify-between bg-brand-gradient p-5 rounded-2xl border border-white/[0.08] shadow-layered-card mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
            <i className="ti ti-books text-xl" aria-hidden="true"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">Manage Batches</h1>
            <p className="text-xs text-white/70">
              {batches.length} {batches.length === 1 ? "active batch" : "active batches"}
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-white text-[#1A237E] shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
        >
          <i className="ti ti-plus text-[16px]" aria-hidden="true" />
          New Batch
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-base-100/70 text-sm gap-2 bg-brand-gradient rounded-2xl border border-white/[0.08] shadow-layered-card">
          <i className="ti ti-loader-2 animate-spin text-xl" aria-hidden="true" />
          Loading batches…
        </div>
      ) : batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-100 gap-4 bg-brand-gradient border border-white/[0.08] rounded-2xl shadow-layered-card">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
            <i className="ti ti-school text-4xl text-white/50" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-white/80">No batches yet. Create your first one.</p>
          <button onClick={openCreate} className="btn border-none bg-white text-[#1A237E] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all px-6">
            Create batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => {
            return (
              <div
                key={batch._id}
                className="bg-base-content border border-base-100/20 rounded-2xl p-5 flex flex-col gap-4 shadow-layered-card hover:-translate-y-1 transition-transform duration-300 shadow-mauve-500 "
              >
                {/* Top row */}
                
                <div className="flex items-start justify-between  gap-2">
                  <h2 className="text-base font-bold text-base-100 leading-snug">{batch.batchName}</h2>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 bg-[#00BCD4]/15 text-[#00BCD4] border border-[#00BCD4]/30 uppercase tracking-wide">
                    {batch.batchSize}
                  </span>
                </div>
             

                {/* Meta */}
                <div className="space-y-2 border-t border-base-100 pt-3">
                  <div className="flex items-center gap-2 text-[12px] text-base-100 font-medium">
                    <i className="ti ti-clock text-[14px] text-[#00BCD4]" aria-hidden="true" />
                    {batch.timing}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-base-100  font-medium">
                    <i className="ti ti-calendar text-[14px] text-[#00BCD4]" aria-hidden="true" />
                    Starts {new Date(batch.startingDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2">
                  <button
                    onClick={() => openEdit(batch)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold text-base-100/90 border border-base-100/[0.1] btn btn-outline btn-primary hover:bg-white/[0.08] transition-colors"
                  >
                    <i className="ti ti-edit text-[14px]" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(batch._id)}
                    disabled={deletingId === batch._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold text-[#FF6B6B] border border-[#FF6B6B]/20 btn btn-outline btn-error hover:bg-[#FF6B6B]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deletingId === batch._id ? (
                      <i className="ti ti-loader-2 animate-spin text-[14px]" aria-hidden="true" />
                    ) : (
                      <i className="ti ti-trash text-[14px]" aria-hidden="true" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-base-content border border-white/[0.1] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 bg-brand-gradient border-b border-white/[0.08]">
              <h2 className="text-sm font-bold text-white">
                {editingBatch ? "Edit batch" : "Create new batch"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <i className="ti ti-x text-[18px]" aria-hidden="true" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-5 space-y-4">

              {error && (
                <div className="flex items-center gap-2 text-[12px] text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg px-3 py-2">
                  <i className="ti ti-alert-circle text-[14px]" aria-hidden="true" />
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] text-base-100/70 uppercase tracking-wider font-semibold">Batch name</label>
                <input
                  name="batchName"
                  value={form.batchName}
                  onChange={handleChange}
                  placeholder="e.g. High Focus Dropper (JEE/NEET)"
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-base-100 placeholder:text-base-100/30 focus:outline-none focus:border-[#00BCD4]/50 focus:bg-white/[0.05] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-base-100/70 uppercase tracking-wider font-semibold">Timing</label>
                <input
                  name="timing"
                  value={form.timing}
                  onChange={handleChange}
                  placeholder="e.g. 8:00 AM – 2:00 PM"
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-base-100 placeholder:text-base-100/30 focus:outline-none focus:border-[#00BCD4]/50 focus:bg-white/[0.05] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-base-100/70 uppercase tracking-wider font-semibold">Start date</label>
                <input
                  type="date"
                  name="startingDate"
                  value={form.startingDate}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-base-100 placeholder:text-base-100/30 focus:outline-none focus:border-[#00BCD4]/50 focus:bg-white/[0.05] transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-base-100/70 uppercase tracking-wider font-semibold">Batch Size</label>
                <input
                  name="batchSize"
                  value={form.batchSize}
                  onChange={handleChange}
                  placeholder="e.g. 50 Students"
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-base-100 placeholder:text-base-100/30 focus:outline-none focus:border-[#00BCD4]/50 focus:bg-white/[0.05] transition-colors"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-white/[0.08] bg-white/[0.02]">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-base-100/70 border border-white/[0.1] hover:bg-white/[0.05] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold bg-brand-gradient text-white border border-[#00BCD4]/30 shadow-brand-glow hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <i className="ti ti-loader-2 animate-spin text-[16px]" aria-hidden="true" />
                ) : (
                  <i className={`ti ${editingBatch ? "ti-check" : "ti-plus"} text-[16px]`} aria-hidden="true" />
                )}
                {saving ? "Saving…" : editingBatch ? "Save changes" : "Create batch"}
              </button>
            </div>
          </div>
        </div>
      )}


       {/* Delete Confirmation Modal */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box border-t-4 border-[#FF6B6B] bg-base-content border-x border-b border-white/[0.08] shadow-2xl">
          <h3 className="font-bold text-xl text-[#FF6B6B]">Confirm Deletion</h3>
          <p className="py-4 text-base-100/80">Are you sure you want to delete this batch? This action cannot be undone.</p>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost btn-outline text-base-100 hover:bg-white/[0.05]" onClick={() => { setBatchToDelete(null); closeDialog('delete_confirm_modal'); }}>Cancel</button>
            <button type="button" className="btn border-none bg-[#FF6B6B] text-white hover:brightness-110" onClick={executeDelete} disabled={deletingId !== null}>
              {deletingId !== null ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
            </button>
          </div>
        </div> 
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button onClick={() => setBatchToDelete(null)}>close</button>
        </form>
      </dialog>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box border-t-4 border-[#00BCD4] bg-base-content border-x border-b border-white/[0.08] shadow-2xl">
          <h3 className="font-bold text-xl text-[#00BCD4] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Success
          </h3>
          <p className="py-4 text-base-100/80">{successMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn border-none bg-[#00BCD4] text-[#1A237E] font-bold hover:brightness-110">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}