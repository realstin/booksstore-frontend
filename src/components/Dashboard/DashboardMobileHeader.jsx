import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LayoutDashboard, Compass,
  Library, User, Settings, LogOut, Loader2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardNavItem from './DashboardNavItem';
import bookstoreLogo from '../../assets/bookstorelogo.svg';

const navItems = [
  { to: '/home',     label: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/explore',  label: 'Explore',    icon: Compass },
  { to: '/library',  label: 'My Library', icon: Library },
  { to: '/profile',  label: 'Profile',    icon: User },
  { to: '/settings', label: 'Settings',   icon: Settings },
];

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function DashboardMobileHeader() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = getInitials(user?.name);

  const close = () => setOpen(false);

  async function handleLogout() {
    if (loggingOut) return;
    close();
    setLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      {/* ── Top bar ── */}
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link
          to="/home"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label="BookStore home"
          onClick={close}
        >
          <img src={bookstoreLogo} alt="BookStore" className="h-6 w-6" />
          <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
            BookStore
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* ── Drawer + overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
              onClick={close}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-label="Navigation menu"
              aria-modal="true"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-[4px_0_24px_rgba(0,0,0,0.08)] lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-5">
                <Link
                  to="/home"
                  onClick={close}
                  className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  <img src={bookstoreLogo} alt="BookStore" className="h-6 w-6" />
                  <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
                    BookStore
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1" role="list">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <DashboardNavItem
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        end={item.end}
                        onClick={close}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* User + logout */}
              <div className="shrink-0 border-t border-neutral-100 px-3 py-4">
                {/* Logout button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label={loggingOut ? 'Logging out…' : 'Log out'}
                  aria-busy={loggingOut}
                >
                  {loggingOut ? (
                    <Loader2 size={17} strokeWidth={2} className="animate-spin shrink-0" aria-hidden="true" />
                  ) : (
                    <LogOut size={17} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
                  )}
                  <span>{loggingOut ? 'Logging out…' : 'Log out'}</span>
                </button>

                <Link
                  to="/profile"
                  onClick={close}
                  className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label="Go to your profile"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white">
                    {initials || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-neutral-900">
                      {user?.name ?? 'User'}
                    </p>
                    {user?.email && (
                      <p className="truncate text-[11.5px] text-neutral-400">
                        {user.email}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default DashboardMobileHeader;
