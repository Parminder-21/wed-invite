'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Users,
  Palette,
  LogOut,
  Eye,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (response.ok && data.authenticated) {
          setUser(data.username);
          setCheckingAuth(false);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Session validation error:', err);
        router.push('/admin/login');
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <svg
          className="animate-spin h-8 w-8 text-[#800020] mb-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm font-semibold tracking-wider">Verifying Session...</span>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Invitation Content', href: '/admin/dashboard/content', icon: FileText },
    { name: 'Festivities (Events)', href: '/admin/dashboard/events', icon: Calendar },
    { name: 'Story & FAQs', href: '/admin/dashboard/story-faq', icon: BookOpen },
    { name: 'Photo Gallery', href: '/admin/dashboard/gallery', icon: ImageIcon },
    { name: 'RSVP Responses', href: '/admin/dashboard/rsvp', icon: Users },
    { name: 'Settings & Theme', href: '/admin/dashboard/theme', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row select-none">
      
      {/* Mobile navbar header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden shadow-sm z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#800020] flex items-center justify-center text-white font-sans font-bold">W</div>
          <span className="font-sans font-bold text-gray-900 tracking-wide text-sm">Wedding Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:static shrink-0 flex flex-col justify-between shadow-sm z-40`}
      >
        <div>
          {/* Logo Brand area */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#800020] flex items-center justify-center text-white font-sans font-bold shadow">W</div>
              <div>
                <h1 className="font-sans font-bold text-gray-900 leading-none text-base tracking-wide">Wedding Admin</h1>
                <span className="text-[10px] text-gray-400 font-medium">Logged in: {user}</span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 hover:text-gray-600 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links Grid */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-red-50 text-[#800020] shadow-sm'
                      : 'text-gray-600 hover:text-[#800020] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-[#800020]' : 'text-gray-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower buttons: Preview & Log out */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#800020] hover:bg-red-50 transition-colors w-full"
          >
            <Eye size={18} />
            Preview Invitation
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
        />
      )}

      {/* Main dashboard content viewport */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 select-text">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
