'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiGithub, FiSend, FiMapPin, FiClock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { toast } from 'react-toastify';

const FAQ = [
  {
    q: 'Is AponVerse free to use?',
    a: 'Yes, AponVerse is completely free. Create an account and start writing instantly.',
  },
  {
    q: 'Can I use images in my posts?',
    a: 'Absolutely! You can upload images directly when creating or editing posts. We handle the hosting for you.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Please contact us via the form below and we\'ll process your request within 48 hours.',
  },
  {
    q: 'Is my data secure?',
    a: 'We take privacy seriously. Your data is never sold and we use industry-standard security practices.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    // Simulate a submission delay (UI-only form)
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

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
            <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link>
            <Link href="/login" className="text-sm font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link href="/about" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-10">
          <FiArrowLeft className="w-4 h-4" />
          About
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/15 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <FiMail className="w-3.5 h-3.5" />
            Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            We&apos;d love to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              hear from you
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Have a question, feedback, or just want to say hi? Drop us a message and we&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-5"
          >
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <FiMail className="w-4 h-4" />
                </div>
                <p className="font-semibold text-white text-sm">Email</p>
              </div>
              <p className="text-slate-400 text-sm">hello@aponverse.com</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                  <FiClock className="w-4 h-4" />
                </div>
                <p className="font-semibold text-white text-sm">Response Time</p>
              </div>
              <p className="text-slate-400 text-sm">Within 24 hours</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-600/20 flex items-center justify-center text-sky-400">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <p className="font-semibold text-white text-sm">Based In</p>
              </div>
              <p className="text-slate-400 text-sm">Bangladesh 🇧🇩</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                  <FiGithub className="w-4 h-4" />
                </div>
                <p className="font-semibold text-white text-sm">Open Source</p>
              </div>
              <p className="text-slate-400 text-sm">Contributions welcome on GitHub</p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 sm:p-8"
          >
            <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 group"
                >
                  <span className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">{item.q}</span>
                  <span className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-5 text-sm text-slate-400 leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
