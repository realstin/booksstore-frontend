import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Library,
  User, Settings, LogOut, Loader2,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardNavItem from './DashboardNavItem';
import bookstoreLogo from '../../assets/bookstorelogo.svg';

const primaryNav = [
  { to: '/home',     label: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/explore',  label: 'Explore',    icon: Compass },
  { to: '/library',  label: 'My Library', icon: Library },
  { to: '/profile',  label: 'Profile',    icon: User },
  { to: '/settings', label: 'Settings',   icon: Settings },
];

const SIDEBAR_STORAGE_KEY = 'bookstowa-dashboard-sidebar-collapsed';

/* Builds avatar initials from a full name string */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = getInitials(user?.name);
  const [loggingOut, setLoggingOut] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // Sidebar still works if browser storage is unavailable.
      }
      return next;
    });
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-neutral-200 bg-white transition-[width] duration-200 ease-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
      aria-label="Dashboard navigation"
    >
      {/* ── Brand + sidebar toggle ── */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-neutral-100 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        }`}
      >
        <Link
          to="/home"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label="BookStore home"
        >
          <img
            src={bookstoreLogo}
            alt="BookStore"
            className="h-6 w-6 shrink-0"
          />
          {!collapsed && (
            <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
              BookStore
            </span>
          )}
        </Link>

        <div className="group relative shrink-0">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} strokeWidth={1.9} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={17} strokeWidth={1.9} aria-hidden="true" />
            )}
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </span>
        </div>
      </div>

      {/* ── Primary nav ── */}
      <nav
        className={`min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-5 ${collapsed ? 'px-2' : 'px-3'}`}
        aria-label="Main navigation"
      >
        <ul className="flex min-w-0 flex-col gap-1" role="list">
          {primaryNav.map((item) => (
            <li key={item.to} className="min-w-0">
              <DashboardNavItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                end={item.end}
                collapsed={collapsed}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User area + logout ── */}
      <div
        className={`shrink-0 border-t border-neutral-100 py-4 ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {/* Logout button */}
        <div className="group relative">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`flex w-full items-center rounded-xl py-2.5 text-[14px] font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            }`}
            aria-label={loggingOut ? 'Logging out…' : 'Log out'}
          >
            {loggingOut ? (
              <Loader2 size={17} strokeWidth={2} className="animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <LogOut size={17} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
            )}
            {!collapsed && <span>{loggingOut ? 'Logging out…' : 'Log out'}</span>}
          </button>
          {collapsed && (
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </span>
          )}
        </div>

        {/* User card */}
        <div className="group relative">
          <Link
            to="/profile"
            className={`mt-3 flex items-center rounded-xl py-2.5 transition-colors duration-150 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            }`}
            aria-label="Go to your profile"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white">
              {initials || '?'}
            </div>
            {!collapsed && (
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
          )}
          </Link>
          {collapsed && (
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
            >
              Profile
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
