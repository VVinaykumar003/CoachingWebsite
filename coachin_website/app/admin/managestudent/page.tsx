"use client";

import React, { useEffect, useState } from "react";

interface Contact {
  _id: string;
  fullName: string;
  course: string;
  whatsapp: string;
  message: string;
  createdAt: string;
}

export default function ManageStudentPage() {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null as string | null);
  const [contactToDelete, setContactToDelete] = useState(null as string | null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contact/get-all");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLDialogElement)?.showModal();
  };

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    openModal("success_modal");
  };

  const confirmDelete = (id: string) => {
    setContactToDelete(id);
    openModal("delete_confirm_modal");
  };

  const executeDelete = async () => {
    if (!contactToDelete) return;
    setDeletingId(contactToDelete);
    try {
      const res = await fetch(`/api/admin/contact/delete/${contactToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== contactToDelete));
        closeModal("delete_confirm_modal");
        showSuccess("Enquiry deleted successfully!");
      } else {
        alert("Failed to delete. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
      setContactToDelete(null);
      closeModal("delete_confirm_modal");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const filtered = contacts.filter((c) =>
    [c.fullName, c.course, c.whatsapp, c.message]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 p-1">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-medium text-base-100">Contact enquiries</h1>
          <span className="text-[11px] bg-primary/15 text-primary px-2.5 py-0.5 rounded-full">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-base-300 text-[15px]" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search by name, course or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-base-content border border-base-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-base-100 placeholder:text-base-300 focus:outline-none focus:border-primary/40"
        />
      </div>

      {/* Table */}
      <div className="bg-base-content rounded-2xl border border-base-200 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-16 text-base-300 text-sm gap-2">
            <i className="ti ti-loader-2 animate-spin text-base" aria-hidden="true" />
            Loading enquiries…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-base-300 gap-2">
            <i className="ti ti-inbox text-3xl" aria-hidden="true" />
            <p className="text-sm">No enquiries found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr className="bg-brand-gradient">
                    {["Name", "Course", "WhatsApp", "Message", "Date", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-medium text-base-content px-4 py-2.5 border-b border-base-200"
                        style={{ width: h === "" ? "60px" : h === "Message" ? "25%" : undefined }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const { date, time } = formatDate(c.createdAt);
                    return (
                      <tr
                        key={c._id}
                        className=" last:border-none hover:bg-base-200/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-base-100 whitespace-nowrap">
                          {c.fullName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block max-w-[160px] truncate">
                            {c.course}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-success">
                            <i className="ti ti-brand-whatsapp text-[13px]" aria-hidden="true" />
                            {c.whatsapp}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-base-300 truncate max-w-[200px]">
                          {c.message || <span className="italic text-base-300/50">No message</span>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[11px] text-base-200">{date}</p>
                          <p className="text-[11px] text-base-300">{time}</p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => confirmDelete(c._id)}
                            disabled={deletingId === c._id}
                            aria-label={`Delete enquiry from ${c.fullName}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium
                              bg-error/10 text-error border border-error/20
                              hover:bg-error/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingId === c._id ? (
                              <i className="ti ti-loader-2 animate-spin text-[13px]" aria-hidden="true" />
                            ) : (
                              <i className="ti ti-trash text-[13px]" aria-hidden="true" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-4 py-2.5 border-t border-base-200">
              <span className="text-[11px] text-base-300">
                Showing {filtered.length} of {contacts.length} entries
              </span>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box border-t-4 border-error bg-base-content">
          <h3 className="font-bold text-xl text-error">Confirm Deletion</h3>
          <p className="py-4 text-base-100/80">Are you sure you want to delete this enquiry? This action cannot be undone.</p>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={() => { setContactToDelete(null); closeModal('delete_confirm_modal'); }}>Cancel</button>
            <button type="button" className="btn btn-error text-white" onClick={executeDelete} disabled={deletingId !== null}>
              {deletingId !== null ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
            </button>
          </div>
        </div> 
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setContactToDelete(null)}>close</button>
        </form>
      </dialog>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box border-t-4 border-success bg-base-content">
          <h3 className="font-bold text-xl text-success flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Success
          </h3>
          <p className="py-4 text-base-100/80">{successMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-success text-white">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}