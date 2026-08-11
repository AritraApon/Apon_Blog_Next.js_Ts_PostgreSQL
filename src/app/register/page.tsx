'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/lib/authContext';
import ThemeToggle from '@/components/ThemeToggle';

const BENEFITS = [
  { icon: '🖊️', text: 'Create unlimited posts with rich images' },
  { icon: '💬', text: 'Comment and react to community posts' },
  { icon: '🏷️', text: 'Organize content with categories' },
  { icon: '👤', text: 'Personalize your public profile' },
];

export default function RegisterPage() {
  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) errs.name = 'Name is required';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      await register(name.trim(), email, password);
      router.replace('/dashboard');
    } catch {
      // Handled in authAction toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-rose-500', 'bg-amber-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div className="min-h-screen av-bg av-text flex relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-12 border-r border-slate-800/60">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:shadow-indigo-600/60 transition-shadow">
            <HiSparkles className="w-5 h-5 text-white" />
          </span>
          <span className="text-xl font-bold text-white tracking-tight">AponVerse</span>
        </Link>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Start your journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                as a writer today.
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-10 max-w-sm">
              Join thousands of creators on AponVerse. Share your voice, grow your audience, and be part of a thriving blogging community.
            </p>
          </motion.div>

          <div className="space-y-3">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <span className="text-lg shrink-0">{b.icon}</span>
                <span>{b.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Explore</Link>
          <span>&copy; {new Date().getFullYear()} AponVerse</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <HiSparkles className="w-4 h-4 text-white" />
            </span>
            <span className="text-lg font-bold av-text">AponVerse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black av-text tracking-tight">Create account</h1>
            <p className="text-slate-400 text-sm mt-1.5">Join AponVerse and start sharing your stories</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FiUser className="w-4.5 h-4.5" />
                </span>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3.5 av-input border ${errors.name ? 'border-rose-500' : 'border-slate-800'} rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} transition-all text-sm`}
                />
              </div>
              {errors.name && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FiMail className="w-4.5 h-4.5" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3.5 av-input border ${errors.email ? 'border-rose-500' : 'border-slate-800'} rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} transition-all text-sm`}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FiLock className="w-4.5 h-4.5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3.5 av-input border ${errors.password ? 'border-rose-500' : 'border-slate-800'} rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'} transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl} className={`h-1 flex-1 rounded-full transition-all ${strength >= lvl ? strengthColors[strength] : 'bg-slate-800'}`} />
                    ))}
                  </div>
                  <span className={`text-[11px] font-semibold ${strength === 1 ? 'text-rose-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiUserPlus className="w-4.5 h-4.5" />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400 lg:hidden">
            <Link href="/about" className="hover:text-slate-200 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">Contact</Link>
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">Explore</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
