'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiEdit, FiLogOut, FiFileText, FiCheck, FiX, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/authContext';
import { updateMe } from '@/actions/userAction';
import { getMyPosts } from '@/actions/postAction';
import { uploadImageToImgBB } from '@/lib/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [postCount, setPostCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
    getMyPosts()
      .then((posts) => setPostCount(posts.length))
      .catch(() => {});
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      let avatarUrl: string | undefined = undefined;

      // Upload avatar to ImgBB if a new file was selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        toast.info('Uploading profile photo...');
        try {
          avatarUrl = await uploadImageToImgBB(avatarFile);
        } finally {
          setIsUploadingAvatar(false);
        }
      }

      const payload: { name: string; bio?: string; avatar?: string } = {
        name: name.trim(),
        bio: bio.trim(),
      };
      if (avatarUrl) payload.avatar = avatarUrl;

      await updateMe(payload);

      // Cleanup preview
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsEditing(false);
    } catch {
      // toast error handled in action
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    setName(user?.name || '');
    setBio(user?.bio || '');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!user) return null;

  const displayAvatar = avatarPreview || user.avatar || null;
  const initials = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Cover Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-950 via-violet-950 to-slate-900" />

        <div className="px-6 sm:px-8 pb-6">
          {/* Avatar + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            {/* Avatar */}
            <div className="relative inline-block">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={user.name || 'Avatar'}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-900 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-3xl border-4 border-slate-900 shadow-xl">
                  {initials}
                </div>
              )}
              {avatarPreview && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                  <FiCheck className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <FiEdit className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Info */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">{user.name || 'User Profile'}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <FiMail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
            {user.bio && <p className="text-sm text-slate-300 pt-2 italic leading-relaxed">{user.bio}</p>}
          </div>
        </div>
      </motion.div>

      {/* Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-4 mb-5">
                Update Profile Information
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Profile Photo */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Current/Preview avatar */}
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl border-2 border-slate-700">
                        {initials}
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-700">
                      <FiCamera className="w-3.5 h-3.5" />
                      <span>{avatarFile ? 'Change Photo' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                    {avatarFile && (
                      <span className="text-xs text-emerald-400 font-medium">
                        ✓ {avatarFile.name.length > 20 ? avatarFile.name.slice(0, 20) + '...' : avatarFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">PNG, JPG, WEBP · Max 5MB · Uploaded to ImgBB</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Bio / About
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Share a short bio about yourself..."
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploadingAvatar}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1"
                  >
                    {(isSaving || isUploadingAvatar) ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiCheck className="w-4 h-4" />
                    )}
                    <span>{isUploadingAvatar ? 'Uploading...' : isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Stats & Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Published Articles</p>
            <p className="text-xl font-bold text-white">{postCount}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <FiUser className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Account Type</p>
            <p className="text-xl font-bold text-white">Author / Writer</p>
          </div>
        </div>
      </div>

      {/* Logout Action Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-white">Sign Out of Account</h4>
          <p className="text-xs text-slate-400">Log out from your current session on this device</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout Now</span>
        </button>
      </div>
    </div>
  );
}
