'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiTrash2, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageSelected: (file: File, previewUrl: string) => void;
  onImageRemoved: () => void;
  label?: string;
  aspectClass?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageSelected,
  onImageRemoved,
  label = 'Featured Image (Optional)',
  aspectClass = 'h-48 sm:h-56',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl || currentImageUrl || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP, GIF)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file, objectUrl);
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageRemoved();
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
        {label}
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {displayUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 ${aspectClass}`}
          >
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-all backdrop-blur-sm flex items-center gap-1.5"
              >
                <FiImage className="w-3.5 h-3.5" />
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-all backdrop-blur-sm flex items-center gap-1.5"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
            {previewUrl && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 bg-indigo-600/90 text-white text-[10px] font-semibold rounded-full backdrop-blur-sm">
                  New image selected
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all bg-slate-950/40 group cursor-pointer ${aspectClass}`}
          >
            <div className="p-3 bg-slate-900 rounded-full group-hover:bg-indigo-600/20 group-hover:text-indigo-400 mb-2 transition-colors">
              <FiUploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Click to upload image</span>
            <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WEBP or GIF · Max 5MB</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
