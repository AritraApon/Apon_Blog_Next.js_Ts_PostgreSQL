import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AponVerse — A Place to Share Stories",
  description: "AponVerse is a modern blogging platform where you can discover ideas, share stories, and connect through words.",
  keywords: "blog, writing, stories, ideas, community",
  openGraph: {
    title: "AponVerse",
    description: "Discover ideas, share stories, and connect through words.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
        />
      </body>
    </html>
  );
}

