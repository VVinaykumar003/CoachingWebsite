"use client";

import React, { useState, useEffect} from "react";

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  category?: string;
  coverImage?: string;
  createdAt?: string;
  status?: string;
}


const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [editingBlog, setEditingBlog] =
    useState<Blog | null>(null);

  const [blogToDelete, setBlogToDelete] =
    useState<string | null>(null);

  const [viewingBlog, setViewingBlog] =
    useState<Blog | null>(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage] = useState(10);

  const openModal = (modalId: string) => {
    (
      document.getElementById(
        modalId
      ) as HTMLDialogElement
    )?.showModal();
  };

  const closeModal = (modalId: string) => {
    (
      document.getElementById(
        modalId
      ) as HTMLDialogElement
    )?.close();
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    openModal("success_modal");
  };

  

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs/get-all");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setBlogs(
        Array.isArray(data) ? data : data.blogs || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch blogs:",
        err
      );
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // =========================
  // ADD BLOG
  // =========================

  const handleAddBlog = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(
      e.currentTarget
    );

    const imageFile =
      formData.get("coverImage");

    if (
      imageFile instanceof File &&
      imageFile.size === 0
    ) {
      formData.delete("coverImage");
    }

    try {
      const response = await fetch(
        "/api/blogs/add",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add blog"
        );
      }

      e.currentTarget.reset();

      closeModal("add_blog_modal");

      fetchBlogs();

      showSuccess(
        "Blog post published successfully!"
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // DELETE BLOG
  // =========================

  const confirmDelete = (id: string) => {
    setBlogToDelete(id);

    openModal("delete_confirm_modal");
  };

  const executeDelete = async () => {
    if (!blogToDelete) return;

    try {
      const response = await fetch(
        `/api/blogs/delete/${blogToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete blog"
        );
      }

      fetchBlogs();

      setBlogToDelete(null);

      closeModal(
        "delete_confirm_modal"
      );

      showSuccess(
        "Blog post deleted successfully!"
      );
    } catch (err) {
      console.error(
        "Failed to delete blog:",
        err
      );

      setBlogToDelete(null);

      closeModal(
        "delete_confirm_modal"
      );
    }
  };

  // =========================
  // EDIT BLOG
  // =========================

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);

    openModal("edit_blog_modal");
  };

  const handleEditBlog = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingBlog) return;

    setIsSubmitting(true);

    const formData = new FormData(
      e.currentTarget
    );

    const imageFile =
      formData.get("coverImage");

    if (
      imageFile instanceof File &&
      imageFile.size === 0
    ) {
      formData.delete("coverImage");
    }

    const blogId =
      editingBlog._id ||
      editingBlog.id;

    try {
      const response = await fetch(
        `/api/blogs/update/${blogId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      console.log(response)

      if (!response.ok) {
        throw new Error(
          "Failed to update blog"
        );
      }

      setEditingBlog(null);

      closeModal("edit_blog_modal");

      fetchBlogs();

      showSuccess(
        "Blog post updated successfully!"
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // PAGINATION
  // =========================

  const indexOfLastBlog =
    currentPage * itemsPerPage;

  const indexOfFirstBlog =
    indexOfLastBlog - itemsPerPage;

  const currentBlogs = blogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );

  const totalPages = Math.ceil(
    blogs.length / itemsPerPage
  );

  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    blogs.length,
    currentPage,
    totalPages,
  ]);

  return (
    <div className="font-sans p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Manage Blogs
          </h1>

          <p className="text-gray-500">
            Create and manage blogs
          </p>
        </div>

        <button
          className="btn bg-brand-gradient"
          onClick={() =>
            openModal("add_blog_modal")
          }
        >
          Add Blog
        </button>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto bg-base-content rounded-xl shadow">
        <table className="table w-full border border-black">
          <thead>
            <tr className="bg-brand-gradient">
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentBlogs.map((blog) => (
              <tr
                key={
                  blog._id || blog.id
                }
                onClick={() => setViewingBlog(blog)}
                className="cursor-pointer"
              >
                <td>{blog.title}</td>

                <td>
                  {blog.category ||
                    "Article"}
                </td>

                <td>
                  {new Date(
                    blog.createdAt ||
                      Date.now()
                  ).toLocaleDateString()}
                </td>

                <td>
                  <span className="badge badge-success text-white">
                    {blog.status ||
                      "Published"}
                  </span>
                </td>

                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-sm btn-outline text-primary  hover:bg-primary hover:text-white"
                      onClick={() =>
                        openEditModal(blog)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline text-error hover:bg-red-500 hover:text-white"
                      onClick={() =>
                        confirmDelete(
                          blog._id ||
                            blog.id ||
                            ""
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {blogs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8"
                >
                  No blogs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Add Blog Modal */}
      <dialog id="add_blog_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl rounded-2xl p-0">
          <form method="dialog">
            <button className="btn btn-sm btn-circle text-white  btn-ghost absolute right-4 top-4">✕</button>
          </form>
          <div className="p-6 border-b border-base-200 bg-brand-gradient">
            <h3 className="font-bold text-2xl text-white">Write New Blog Post</h3>
            <p className="text-sm text-white mt-1">Draft a new success story, study tip, or philosophy post.</p>
          </div>
          
          <form onSubmit={handleAddBlog}>
            <div className="p-6 space-y-4 bg-base-content">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-bold text-base-100">Post Title</span></label>
              <input name="title" required type="text" placeholder="e.g. How to maintain focus during revisions" className="input border border-primary w-full focus:outline-primary bg-base-content" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-100">Category</span></label>
                <select name="category" className="select border border-primary w-full focus:outline-primary bg-base-content" defaultValue="Select Category">
                  <option disabled>Select Category</option>
                  <option>Study Tips</option>
                  <option>Success Story</option>
                  <option>Philosophy / Motivation</option>
                  <option>Announcements</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-100">Cover Image</span></label>
                <input type="file" name="coverImage" accept="image/*" className="file-input border border-primary w-full focus:outline-primary bg-base-content" />
                <label className="label">
                  <span className="label-text-alt text-base-100/60">Upload an image (Max resolution: <span className="font-bold">1200x630</span> 
                  <br/> pixels, up to 2MB).</span>
                </label>
              </div>
            </div>

            <div className="form-control w-full flex flex-col ">
              <label className="label"><span className="label-text font-bold text-base-100">Content</span></label>
              <textarea name="content" required className="textarea border border-primary  h-44 focus:outline-primary bg-base-content  font-mono text-sm w-full" placeholder="Write your content here..."></textarea>
            </div>
          </div>

          <div className="p-6 border-t border-base-200 bg-base-content flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick= {closeModal}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn border-none bg-brand-gradient shadow-elevation-soft">
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Publish Post"}
              </button>
          </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>


       {/* Edit Blog Modal */}
      <dialog id="edit_blog_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl rounded-2xl p-0">
          <form method="dialog">
            <button className="btn btn-sm btn-circle text-white btn-ghost absolute right-4 top-4" onClick={() => setEditingBlog(null)}>✕</button>
          </form>
          <div className="p-6 border-b border-base-200 bg-brand-gradient">
            <h3 className="font-bold text-2xl text-white">Edit Blog Post</h3>
            <p className="text-sm text-white mt-1">Update your success story, study tip, or philosophy post.</p>
          </div>
          
          <form onSubmit={handleEditBlog} key={editingBlog?._id || editingBlog?.id || 'edit-form'}>
            <div className="p-6 space-y-4 bg-base-content">
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-bold text-base-100">Post Title</span></label>
              <input name="title" required type="text" defaultValue={editingBlog?.title} placeholder="e.g. How to maintain focus during revisions" className="input  w-full focus:outline-primary bg-base-content border border-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-100">Category</span></label>
                <select name="category" className="select  w-full focus:outline-primary bg-base-content border border-primary" defaultValue={editingBlog?.category || "Select Category"}>
                  <option disabled>Select Category</option>
                  <option>Study Tips</option>
                  <option>Success Story</option>
                  <option>Philosophy / Motivation</option>
                  <option>Announcements</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold text-base-100">Cover Image</span></label>
                <input type="file" name="coverImage" accept="image/*" className="file-input border border-primary w-full focus:outline-primary bg-base-content " />
                <label className="label">
                  <span className="label-text-alt text-base-100/60">Upload a new image to replace the <br/> current one.</span>
                </label>
              </div>
            </div>

            <div className="form-control w-full flex flex-col ">
              <label className="label"><span className="label-text font-bold text-base-100">Content</span></label>
              <textarea name="content" required defaultValue={editingBlog?.content} className="textarea  h-54 focus:outline-primary bg-base-content border border-primary font-mono text-sm w-auto" placeholder="Write your content here..."></textarea>
            </div>
          </div>

          <div className="p-6 border-t border-base-200 bg-base-content flex justify-end gap-2">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn border-none bg-brand-gradient shadow-elevation-soft">
                {isSubmitting ? <span className="loading loading-spinner"></span> : "Update Post"}
              </button>
          </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setEditingBlog(null)}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box border-t-4 border-error">
          <h3 className="font-bold text-xl text-error">Confirm Deletion</h3>
          <p className="py-4 text-base-content/80">Are you sure you want to delete this blog post? This action cannot be undone.</p>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="button" className="btn btn-error text-white" onClick={executeDelete}>
              Yes, Delete Post
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setBlogToDelete(null)}>close</button>
        </form>
      </dialog>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box border-t-4 border-success">
          <h3 className="font-bold text-xl text-success flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Success
          </h3>
          <p className="py-4 text-base-content/80">{successMessage}</p>
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

      {/* View Blog Drawer */}
      <div className={`fixed inset-0 z-[60] overflow-hidden ${viewingBlog ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${viewingBlog ? 'opacity-100' : 'opacity-0'}`} onClick={() => setViewingBlog(null)}></div>
        <div className={`absolute inset-y-0 right-0 max-w-xl w-full bg-base-content shadow-2xl transform transition-transform duration-300 ease-in-out ${viewingBlog ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          {viewingBlog && (
            <>
              <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-content sticky top-0 z-10">
                <h2 className="text-2xl font-bold truncate pr-4">{viewingBlog.title}</h2>
                <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setViewingBlog(null)}>✕</button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-base-50">
                {viewingBlog.coverImage && (
                  <img src={viewingBlog.coverImage} alt="Cover" className="w-full h-64 object-cover rounded-xl shadow-sm" 
                   loading='lazy'
                  />
                )}
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-primary">{viewingBlog.category || 'Article'}</span>
                  <span className="badge badge-outline">{new Date(viewingBlog.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span className="badge badge-success text-white">{viewingBlog.status || 'Published'}</span>
                </div>
                <div className="prose max-w-none font-mono text-sm whitespace-pre-wrap text-base-100/80">
                  {viewingBlog.content}
                </div>
              </div>
              <div className="p-6 border-t border-base-200 bg-base-content flex justify-end gap-2">
                <button className="btn btn-outline text-primary" onClick={() => { setViewingBlog(null); openEditModal(viewingBlog); }}>Edit Post</button>
                <button className="btn btn-outline text-error hover:bg-error hover:text-white" onClick={() => { setViewingBlog(null); confirmDelete(viewingBlog._id || viewingBlog.id); }}>Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBlogs;