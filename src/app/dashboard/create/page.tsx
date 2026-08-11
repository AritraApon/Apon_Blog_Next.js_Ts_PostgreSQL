'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlusCircle,
  FiTag,
  FiFileText,
  FiArrowLeft,
  FiTrash2,
  FiUploadCloud,
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Category } from '@/lib/types';
import { getCategories } from '@/actions/categoryAction';
import { createPost } from '@/actions/postAction';
import { uploadImageToImgBB } from '@/lib/api';

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCategories(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Handle local image selection & preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const localPreview = URL.createObjectURL(file);
    setImagePreviewUrl(localPreview);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a post title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter post description / content');
      return;
    }

    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | undefined = undefined;

      if (imageFile) {
        toast.info('Uploading image to ImgBB...');
        uploadedImageUrl = await uploadImageToImgBB(imageFile);
      }

      await createPost({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        image: uploadedImageUrl,
      });

      router.push('/dashboard/my-posts');
    } catch (err: unknown) {
      console.error('Post creation failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to Feed</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="av-card border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-slate-800/60 pb-5">
          <div className="p-3 bg-indigo-600/20 text-indigo-500 rounded-xl">
            <FiPlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold av-text">Create New Post</h1>
            <p className="text-xs text-slate-400">Publish your story or tutorial</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FiFileText className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="w-full pl-11 pr-4 py-3 av-input border border-slate-800 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Category Dropdown Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <FiTag className="w-5 h-5" />
              </span>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className="w-full pl-11 pr-4 py-3 av-input border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 appearance-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {categories.length === 0 && !loadingCategories && (
              <p className="text-xs text-amber-400 mt-1.5">
                No categories found. Please contact administrator to seed categories.
              </p>
            )}
          </div>

          {/* Optional Image Upload & Immediate Local Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Featured Image (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {!imagePreviewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all bg-slate-950/20 group"
              >
                <div className="p-3 bg-slate-800/40 rounded-full group-hover:bg-indigo-600/20 group-hover:text-indigo-400 mb-2 transition-colors">
                  <FiUploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Click to upload image</span>
                <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WEBP or GIF (Max 5MB)</span>
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-xl overflow-hidden border border-slate-800 p-2"
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Remove Image</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Post Description / Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Description / Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your detailed blog post content..."
              className="w-full p-4 av-input border border-slate-800 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
            ></textarea>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Publishing Post...</span>
                </>
              ) : (
                <>
                  <FiPlusCircle className="w-4 h-4" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
