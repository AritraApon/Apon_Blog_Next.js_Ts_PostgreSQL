'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiUsers, FiMessageSquare, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const VALUES = [
  {
    icon: <FiEdit3 className="w-5 h-5" />,
    title: 'Freedom to Write',
    desc: 'Express your thoughts, ideas, and stories without limitations. AponVerse gives every writer a powerful and elegant space.',
    color: 'from-indigo-600/20 to-indigo-600/5 border-indigo-500/30 text-indigo-400',
  },
  {
    icon: <FiUsers className="w-5 h-5" />,
    title: 'Community First',
    desc: 'We believe in the power of community. Every reader, commenter, and creator is an essential part of the AponVerse ecosystem.',
    color: 'from-violet-600/20 to-violet-600/5 border-violet-500/30 text-violet-400',
  },
  {
    icon: <FiMessageSquare className="w-5 h-5" />,
    title: 'Meaningful Dialogue',
    desc: 'Comments and reactions spark conversations that go deeper than surface level. We encourage thoughtful, respectful engagement.',
    color: 'from-sky-600/20 to-sky-600/5 border-sky-500/30 text-sky-400',
  },
  {
    icon: <FiTrendingUp className="w-5 h-5" />,
    title: 'Growth & Discovery',
    desc: 'Explore posts by category, discover new voices, and grow your own audience with tools designed for modern creators.',
    color: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
  },
  {
    icon: <FiHeart className="w-5 h-5" />,
    title: 'Passion-Driven',
    desc: 'AponVerse was built with genuine love for writing and the craft of storytelling. We care deeply about the reader experience.',
    color: 'from-rose-600/20 to-rose-600/5 border-rose-500/30 text-rose-400',
  },
  {
    icon: <HiSparkles className="w-5 h-5" />,
    title: 'Always Evolving',
    desc: 'We continuously improve based on feedback from our community. Your voice shapes the direction of AponVerse.',
    color: 'from-amber-600/20 to-amber-600/5 border-amber-500/30 text-amber-400',
  },
];

const STATS = [
  { value: '500+', label: 'Stories Published' },
  { value: '200+', label: 'Community Members' },
  { value: '50+', label: 'Categories' },
  { value: '∞', label: 'Imagination' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/40 group-hover:shadow-indigo-600/60 transition-shadow">
              <HiSparkles className="w-4 h-4 text-white" />
            </span>
            <span className="text-base font-bold text-white">AponVerse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="text-sm font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-10">
          <FiArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/15 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <HiSparkles className="w-3.5 h-3.5" />
            About AponVerse
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
            A universe built<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              for storytellers
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            AponVerse is a modern blogging platform that empowers writers to share their ideas, connect with readers, and build a community around their words.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-20 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            We built AponVerse because we believe every person has a story worth telling. Our mission is to lower the barriers to publishing, amplify creative voices, and create a space where ideas can flourish, connect, and inspire.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className={`bg-gradient-to-br ${v.color} border rounded-2xl p-6`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 bg-slate-900/60 ${v.color.split(' ').find(c => c.startsWith('text-'))}`}>
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border border-indigo-500/20 rounded-3xl p-10 sm:p-14"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to share your story?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join AponVerse for free and start publishing to a growing community of passionate readers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm w-full sm:w-auto text-center"
            >
              Create Free Account
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-all text-sm w-full sm:w-auto text-center"
            >
              Browse Posts
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
