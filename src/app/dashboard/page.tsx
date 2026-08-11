'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiCompass,
  FiEdit3,
  FiHeart,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, Category } from '@/lib/types';
import { getAllPosts } from '@/actions/postAction';
import { getCategories } from '@/actions/categoryAction';

function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const authorName = post.author?.name || post.user?.name || 'Anonymous';
  const authorAvatar = post.author?.avatar || post.user?.avatar || null;
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryName =
    typeof post.category === 'object' ? post.category?.name : post.category || 'General';
  const date = new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const likesCount = post.likesCount || post._count?.reactions || post._count?.likes || (post.reactions ? post.reactions.length : 0);
  const commentsCount = post.commentsCount || post._count?.comments || (post.comments ? post.comments.length : 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      onClick={() => router.push(`/dashboard/posts/${post.id}`)}
      className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-indigo-900/20"
    >
      {/* Image Banner */}
      {post.image && (
        <div className="h-52 sm:h-60 w-full overflow-hidden bg-slate-950 relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Category + Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-500/20">
            <FiTag className="w-3 h-3" />
            {categoryName}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2 mb-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        {(post.description || post.content) && (
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
            {post.description || post.content}
          </p>
        )}

        {/* Footer: Author + Metrics */}
        <div
          className="flex items-center justify-between pt-4 border-t border-slate-800/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-700 flex items-center justify-center text-slate-300 text-[11px] font-bold">
                {authorInitial}
              </div>
            )}
            <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
              {authorName}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <FiHeart className="w-3.5 h-3.5 text-rose-400" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare className="w-3.5 h-3.5 text-slate-400" />
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function DashboardExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch {
      // handled
    }
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllPosts(page, 8, search);
      let filteredPosts = res.posts;

      if (selectedCategory) {
        filteredPosts = filteredPosts.filter((p) => {
          const catId =
            typeof p.category === 'object'
              ? p.category?.id?.toString()
              : p.categoryId?.toString();
          return catId === selectedCategory;
        });
      }

      setPosts(filteredPosts);
      setTotalPages(res.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, page]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadPosts]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full mb-3 border border-indigo-500/20">
              <FiCompass className="w-3.5 h-3.5" />
              <span>Community Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore Stories
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse ideas, tutorials and perspectives from the community.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto shrink-0"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Write Post</span>
          </Link>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
          <FiSearch className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => { setSelectedCategory(''); setPage(1); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id.toString()); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              selectedCategory === cat.id.toString()
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-6 bg-slate-800 rounded w-3/4" />
              <div className="h-16 bg-slate-800 rounded" />
              <div className="h-4 bg-slate-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
            <FiCompass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No Posts Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            {search || selectedCategory
              ? "No articles match your filters. Try adjusting your search."
              : "No posts have been published yet. Be the first!"}
          </p>
          <div className="flex gap-3">
            {(search || selectedCategory) && (
              <button
                onClick={() => { setSearch(''); setSelectedCategory(''); setPage(1); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
            <Link
              href="/dashboard/create"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Write First Post
            </Link>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-medium text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
