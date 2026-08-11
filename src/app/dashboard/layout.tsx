'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiCompass,
  FiPlusCircle,
  FiFileText,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '@/lib/authContext';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { name: 'Explore', href: '/dashboard', icon: FiCompass },
  { name: 'Create Post', href: '/dashboard/create', icon: FiPlusCircle },
  { name: 'My Posts', href: '/dashboard/my-posts', icon: FiFileText },
  { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center av-bg av-text">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row av-bg av-text">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 av-nav border-r border-slate-800/60 p-5 sticky top-0 h-screen justify-between z-30">
        <div>
          {/* App Brand Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-600/50 transition-shadow">
                <HiSparkles className="w-5 h-5 text-white" />
              </span>
              <div>
                <h1 className="font-bold text-base av-text leading-tight tracking-tight">AponVerse</h1>
                <span className="text-[11px] text-slate-500 font-medium">Blog Platform</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href} className="relative block">
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute inset-0 bg-indigo-600/15 border-l-4 border-indigo-500 rounded-lg"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative z-10 ${
                      isActive
                        ? 'text-indigo-500 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || 'Avatar'} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 shadow-md" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold av-text truncate">{user.name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between px-5 py-4 av-nav border-b border-slate-800/60 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <HiSparkles className="w-4 h-4 text-white" />
          </span>
          <span className="font-bold text-base av-text tracking-tight">AponVerse</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || 'Avatar'} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Content Area */}
      <main className="flex-1 pb-20 md:pb-8 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 av-nav border-t border-slate-800/60 px-3 py-2 justify-around items-center backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${
                isActive ? 'text-indigo-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveDot"
                  className="w-1 h-1 bg-indigo-500 rounded-full absolute -bottom-1"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
