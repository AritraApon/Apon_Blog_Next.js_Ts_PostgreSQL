'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiHeart,
  FiMessageSquare,
  FiCalendar,
  FiSend,
  FiClock,
  FiTrash2,
  FiTag,
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Post, Comment } from '@/lib/types';
import { getPostById } from '@/actions/postAction';
import { getCommentsByPost, createComment, deleteComment } from '@/actions/commentAction';
import { getReactionsByPost, toggleReaction } from '@/actions/reactionAction';
import { useAuth } from '@/lib/authContext';

export default function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const { user: currentUser } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await getPostById(postId);
        setPost(data);

        if (data) {
          const reactions = await getReactionsByPost(postId);
          setLikesCount(reactions.length || data.likesCount || data._count?.reactions || 0);

          const comRes = await getCommentsByPost(postId);
          setComments(comRes.length > 0 ? comRes : data.comments || []);
        }
      } catch {
        toast.error('Failed to load post details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [postId]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await toggleReaction(postId);
    } catch {
      setIsLiked(!nextState);
      setLikesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      await createComment(postId, newComment.trim());
      setNewComment('');
      const updated = await getCommentsByPost(postId);
      setComments(updated);
    } catch {
      // toast error handled in action
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    const success = await deleteComment(commentId);
    if (success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-60 bg-slate-900 rounded-2xl" />
        <div className="h-8 bg-slate-900 rounded w-3/4" />
        <div className="h-4 bg-slate-900 rounded w-1/2" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-slate-900 rounded" />)}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-2">Post Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The article you are looking for does not exist or was removed.</p>
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
          Back to Feed
        </Link>
      </div>
    );
  }

  const authorName = post.author?.name || post.user?.name || 'Anonymous';
  const authorAvatar = post.author?.avatar || post.user?.avatar || null;
  const categoryName = typeof post.category === 'object' ? post.category?.name : post.category || 'General';
  const readingTime = Math.max(1, Math.ceil(((post.description || post.content || '').length / 5) / 200));

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors group"
      >
        <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Feed</span>
      </Link>

      {/* Main Article */}
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Hero Image */}
        {post.image && (
          <div className="w-full aspect-[16/7] overflow-hidden bg-slate-950 relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Category + Reading time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-500/20">
              <FiTag className="w-3 h-3" />
              {categoryName}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center justify-between gap-4 py-4 border-y border-slate-800/60">
            <div className="flex items-center gap-3">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-base">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-100 text-sm">{authorName}</p>
                {post.author?.email && (
                  <p className="text-[11px] text-slate-500">{post.author.email}</p>
                )}
              </div>
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1.5 shrink-0">
              <FiCalendar className="w-3.5 h-3.5" />
              {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>

          {/* Article Body */}
          <div className="text-slate-300 text-[15px] leading-[1.85] whitespace-pre-wrap">
            {post.description || post.content}
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-transparent'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </motion.button>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <FiMessageSquare className="w-4 h-4" />
              <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Comments Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiMessageSquare className="w-4.5 h-4.5 text-indigo-400" />
            <span>Discussion ({comments.length})</span>
          </h3>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-start">
            {/* Current user avatar */}
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0 mt-1" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {commenting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                No comments yet. Start the conversation!
              </p>
            ) : (
              comments.map((comment) => {
                const commentAuthor = comment.author?.name || comment.user?.name || 'Community Member';
                const commentAvatar = comment.author?.avatar || comment.user?.avatar || null;
                const isOwner = currentUser && (
                  comment.authorId === currentUser.id ||
                  comment.author?.email === currentUser.email
                );

                return (
                  <div
                    key={comment.id}
                    className="flex gap-3 items-start bg-slate-950/60 border border-slate-800/60 rounded-xl p-4"
                  >
                    {/* Avatar */}
                    {commentAvatar ? (
                      <img src={commentAvatar} alt={commentAuthor} className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-[10px] font-bold shrink-0 mt-0.5">
                        {commentAuthor.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-200">{commentAuthor}</span>
                          <span className="text-slate-600 flex items-center gap-0.5">
                            <FiClock className="w-3 h-3" />
                            {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-slate-600 hover:text-rose-400 p-1 transition-colors shrink-0"
                            title="Delete comment"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
