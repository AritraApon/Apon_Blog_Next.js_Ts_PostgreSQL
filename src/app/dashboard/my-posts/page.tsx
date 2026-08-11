'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiCalendar,
  FiX,
  FiAlertTriangle,
  FiEye,
  FiImage,
  FiUploadCloud,
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Post, Category } from '@/lib/types';
import { getMyPosts, updatePost, deletePost } from '@/actions/postAction';
import { getCategories } from '@/actions/categoryAction';
import { uploadImageToImgBB } from '@/lib/api';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit image state
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete Modal state
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMyPosts = async () => {
    setLoading(true);
    try {
      const data = await getMyPosts();
      setPosts(data);
    } catch {
      // toast error handled in action
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description || post.content || '');
    setEditCategory(
      typeof post.category === 'object'
        ? post.category?.id?.toString() || ''
        : post.categoryId?.toString() || ''
    );
    setEditImageFile(null);
    setEditImagePreview(null);
    setRemoveImage(false);
  };

  const closeEditModal = () => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditingPost(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setRemoveImage(false);
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editTitle.trim() || !editDescription.trim()) return;

    setIsUpdating(true);
    try {
      let imageUrl: string | null | undefined = undefined;

      if (editImageFile) {
        setIsUploadingImage(true);
        toast.info('Uploading new image...');
        try {
          imageUrl = await uploadImageToImgBB(editImageFile);
        } finally {
          setIsUploadingImage(false);
        }
      } else if (removeImage) {
        imageUrl = null;
      }

      const payload: Record<string, any> = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        categoryId: editCategory || undefined,
      };
      if (imageUrl !== undefined) payload.image = imageUrl;

      await updatePost(editingPost.id, payload);
      closeEditModal();
      loadMyPosts();
    } catch {
      // handled
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      const ok = await deletePost(deletingPost.id);
      if (ok) {
        setDeletingPost(null);
        loadMyPosts();
      }
    } catch {
      // handled
    } finally {
      setIsDeleting(false);
    }
  };

  const currentEditImage = editImagePreview || (removeImage ? null : editingPost?.image);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiFileText className="w-6 h-6 text-indigo-400" />
            <span>My Posts</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and edit your published articles</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all self-start sm:self-auto"
        >
          <FiPlusCircle className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mb-3">
            <FiFileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">No Posts Created Yet</h3>
          <p className="text-xs text-slate-400 mb-5">You haven't authored any blog posts so far.</p>
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-800 hidden sm:block flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-slate-800 bg-slate-950 hidden sm:flex items-center justify-center text-slate-700 flex-shrink-0">
                    <FiImage className="w-6 h-6" />
                  </div>
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-medium rounded border border-indigo-500/20">
                      {typeof post.category === 'object' ? post.category?.name : post.category || 'General'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{post.description || post.content}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto pt-2 md:pt-0 flex-shrink-0">
                <Link
                  href={`/dashboard/posts/${post.id}`}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                  title="View"
                >
                  <FiEye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => openEditModal(post)}
                  className="p-2.5 bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-300 rounded-xl transition-colors"
                  title="Edit"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingPost(post)}
                  className="p-2.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 rounded-xl transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <h3 className="text-base font-bold text-white">Edit Post</h3>
                <button onClick={closeEditModal} className="text-slate-400 hover:text-white transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Category */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Image Section */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Featured Image</label>
                  {currentEditImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 h-40">
                      <img src={currentEditImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {editImagePreview && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-indigo-600/90 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
                            New image
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <label className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all backdrop-blur-sm flex items-center gap-1.5 cursor-pointer">
                          <FiImage className="w-3 h-3" />
                          Change
                          <input type="file" accept="image/*" className="hidden" onChange={handleEditImageSelect} />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (editImagePreview) URL.revokeObjectURL(editImagePreview);
                            setEditImageFile(null);
                            setEditImagePreview(null);
                            setRemoveImage(true);
                          }}
                          className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-all backdrop-blur-sm flex items-center gap-1.5"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl h-28 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all bg-slate-950/40 group cursor-pointer">
                      <FiUploadCloud className="w-5 h-5 mb-1 group-hover:text-indigo-400" />
                      <span className="text-xs font-semibold">Click to upload image</span>
                      <span className="text-[11px] text-slate-500">PNG, JPG, WEBP · Max 5MB</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleEditImageSelect} />
                    </label>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description / Content</label>
                  <textarea
                    required
                    rows={5}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || isUploadingImage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                  >
                    {(isUpdating || isUploadingImage) && (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isUploadingImage ? 'Uploading...' : isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Post?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="text-white font-semibold">"{deletingPost.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingPost(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  {isDeleting && <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
