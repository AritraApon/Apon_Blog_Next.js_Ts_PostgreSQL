'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiCompass,
  FiEdit3,
  FiHeart,
  FiMessageSquare,
  FiCalendar,
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
      transition={{ duration: 0.22 }}
      onClick={() => router.push(`/dashboard/posts/${post.id}`)}
      className="group av-card border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-indigo-900/10"
    >
      {/* Image Banner */}
      {post.image && (
        <div className="h-52 sm:h-60 w-full overflow-hidden bg-slate-950/40 relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Category + Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-500/20">
            <FiTag className="w-3 h-3" />
            {categoryName}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold av-text group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 mb-2">
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
          className="flex items-center justify-between pt-4 border-t border-slate-800/40"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 border border-slate-700 flex items-center justify-center text-white text-[11px] font-bold">
                {authorInitial}
              </div>
            )}
            <span className="text-xs font-medium text-slate-300 truncate max-w-[120px]">
              {authorName}
            </span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FiHeart className="w-3.5 h-3.5 text-rose-400" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare className="w-3.5 h-3.5" />
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

  // Infinite scroll pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch posts helper
  const fetchPostsPage = useCallback(async (pageNum: number, isReset: boolean) => {
    if (pageNum === 1) {
      setLoadingInitial(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const limit = 6;
      const res = await getAllPosts(pageNum, limit, search);
      let fetched: Post[] = res.posts || [];

      // Category client filtering if applicable
      if (selectedCategory) {
        fetched = fetched.filter((p) => {
          const catId =
            typeof p.category === 'object'
              ? p.category?.id?.toString()
              : p.categoryId?.toString();
          return catId === selectedCategory;
        });
      }

      setPosts((prev) => {
        if (isReset) return fetched;
        // Append unique posts only
        const existingIds = new Set(prev.map((p) => p.id));
        const newUnique = fetched.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newUnique];
      });

      // Determine if there are more pages
      const totalPages = res.totalPages || 1;
      setHasMore(pageNum < totalPages && fetched.length > 0);
    } catch {
      if (isReset) setPosts([]);
      setHasMore(false);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }, [search, selectedCategory]);

  // Reset and fetch page 1 whenever search or category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    const timer = setTimeout(() => {
      fetchPostsPage(1, true);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, fetchPostsPage]);

  // IntersectionObserver callback for Infinite Scroll
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingInitial || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingInitial) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchPostsPage(nextPage, false);
            return nextPage;
          });
        }
      }, { threshold: 0.2 });

      if (node) observerRef.current.observe(node);
    },
    [loadingInitial, loadingMore, hasMore, fetchPostsPage]
  );

  // Horizontal mouse-wheel scrolling for category bar
  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

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
            <p className="text-sm text-slate-300 mt-1">
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts by title or content..."
          className="w-full pl-10 pr-4 py-3 av-input border border-slate-800 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
        />
      </div>

      {/* Category Filter Pills — Horizontal Scroll */}
     <div className="relative group">
  {/* Left Scroll Button */}
  <button
    type="button"
    onClick={() => {
      categoryScrollRef.current?.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    }}
    className="absolute left-0 top-1/2 -translate-y-1/2 z-10
               w-8 h-8 rounded-full
               bg-slate-900/90 border border-slate-700
               text-white flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition-opacity shadow-lg"
    aria-label="Scroll categories left"
  >
    ‹
  </button>

  {/* Categories */}
  <div
    ref={categoryScrollRef}
    onWheel={handleCategoryWheel}
    className="
      flex items-center gap-2
      overflow-x-auto
      flex-nowrap
      scrollbar-none
      py-1 px-9
      touch-pan-x
      scroll-smooth
    "
  >
    <button
      onClick={() => setSelectedCategory("")}
      className={`px-4 py-1.5 rounded-xl text-xs font-semibold
        whitespace-nowrap transition-all shrink-0 ${
          selectedCategory === ""
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]"
            : "av-card text-slate-400 hover:text-slate-200 border border-slate-800/80"
        }`}
    >
      All Categories
    </button>

    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat.id.toString())}
        className={`px-4 py-1.5 rounded-xl text-xs font-semibold
          whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            selectedCategory === cat.id.toString()
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]"
              : "av-card text-slate-400 hover:text-slate-200 border border-slate-800/80"
          }`}
      >
        <FiTag className="w-3 h-3" />
        <span>{cat.name}</span>
      </button>
    ))}
  </div>

  {/* Right Scroll Button */}
  <button
    type="button"
    onClick={() => {
      categoryScrollRef.current?.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    }}
    className="absolute right-0 top-1/2 -translate-y-1/2 z-10
               w-8 h-8 rounded-full
               bg-slate-900/90 border border-slate-700
               text-white flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition-opacity shadow-lg"
    aria-label="Scroll categories right"
  >
    ›
  </button>
</div>

      {/* Posts Feed */}
      {loadingInitial ? (
        <div className="space-y-5">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="av-card border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800/60 rounded w-1/4" />
              <div className="h-6 bg-slate-800/60 rounded w-3/4" />
              <div className="h-16 bg-slate-800/60 rounded" />
              <div className="h-4 bg-slate-800/60 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="av-card border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 bg-slate-800/50 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
            <FiCompass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold av-text mb-1">No Posts Found</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            {search || selectedCategory
              ? "No articles match your search or filter criteria."
              : "No posts have been published yet."}
          </p>
          {(search || selectedCategory) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory(''); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Intersection Observer Target */}
          <div ref={lastPostRef} className="h-4 w-full" />

          {/* Loading Skeleton when fetching next page */}
          {loadingMore && (
            <div className="av-card border border-slate-800/80 rounded-2xl p-6 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-800/60 rounded w-1/4" />
              <div className="h-5 bg-slate-800/60 rounded w-3/4" />
              <div className="h-12 bg-slate-800/60 rounded" />
            </div>
          )}

          {/* End of feed message */}
          {!hasMore && posts.length > 0 && (
            <div className="py-6 text-center text-xs text-slate-500 font-medium border-t border-slate-800/40">
              You&apos;ve reached the end of the feed • {posts.length} posts loaded
            </div>
          )}
        </div>
      )}
    </div>
  );
}
