'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { PrintifyProvider } from "@/lib/PrintifyContext";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fanjoy - Creator Merch Platform",
  description: "Sell your merch directly to your fans",
};

function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="mt-4">
      <Link
        href="/dashboard"
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
          isActive('/dashboard') ? 'bg-gray-100' : ''
        }`}
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </Link>
      <Link
        href="/designs"
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
          isActive('/designs') ? 'bg-gray-100' : ''
        }`}
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Designs
      </Link>
      <Link
        href="/products"
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
          isActive('/products') ? 'bg-gray-100' : ''
        }`}
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Products
      </Link>
      <Link
        href="/orders"
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
          isActive('/orders') ? 'bg-gray-100' : ''
        }`}
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Orders
      </Link>
      <button
        onClick={() => signOut()}
        className="flex items-center w-full px-4 py-2 mt-4 text-gray-700 hover:bg-gray-100"
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <PrintifyProvider>
              <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                          <Link href="/" className="text-2xl font-bold text-blue-600">
                            Fanjoy
                          </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                          <Link
                            href="/products"
                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          >
                            Products
                          </Link>
                          <Link
                            href="/dashboard"
                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                          >
                            Dashboard
                          </Link>
                        </div>
                      </div>
                      <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Link
                          href="/auth/signin"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  {children}
                </main>

                <footer className="bg-white border-t">
                  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500 text-sm">
                      © {new Date().getFullYear()} Fanjoy. All rights reserved.
                    </div>
                  </div>
                </footer>
              </div>
            </PrintifyProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
