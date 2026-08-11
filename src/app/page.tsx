'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { HiSparkles } from 'react-icons/hi2';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 animate-pulse">
        <HiSparkles className="w-7 h-7 text-white" />
      </div>
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
