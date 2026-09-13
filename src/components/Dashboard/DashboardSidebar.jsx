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
      {/* ── Brand ── */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-neutral-100 ${
          collapsed ? 'justify-center px-2' : 'gap-2.5 px-5'
        }`}
      >
        <Link
          to="/home"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label="BookStore home"
          title={collapsed ? 'BookStore home' : undefined}
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
      </div>

      {/* ── Primary nav ── */}
      <nav
        className={`flex-1 overflow-y-auto py-5 ${collapsed ? 'px-2' : 'px-3'}`}
        aria-label="Main navigation"
      >
        <ul className="flex flex-col gap-1" role="list">
          {primaryNav.map((item) => (
            <li key={item.to}>
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

      {/* ── Sidebar controls + user area ── */}
      <div
        className={`shrink-0 border-t border-neutral-100 py-4 ${
          collapsed ? 'px-2' : 'px-3'
        }`}
      >
        {/* Collapse / expand control */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`group flex w-full items-center rounded-xl py-2.5 text-[14px] font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={17} strokeWidth={1.9} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={17} strokeWidth={1.9} aria-hidden="true" />
          )}
          {!collapsed && <span>Collapse sidebar</span>}
        </button>

        {/* Logout button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className={`group mt-1 flex w-full items-center rounded-xl py-2.5 text-[14px] font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          }`}
          aria-label={loggingOut ? 'Logging out…' : 'Log out'}
          aria-busy={loggingOut}
          title={collapsed ? (loggingOut ? 'Logging out…' : 'Log out') : undefined}
        >
          {loggingOut ? (
            <Loader2 size={17} strokeWidth={2} className="animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <LogOut size={17} strokeWidth={1.9} className="shrink-0" aria-hidden="true" />
          )}
          {!collapsed && <span>{loggingOut ? 'Logging out…' : 'Log out'}</span>}
        </button>

        {/* User card */}
        <Link
          to="/profile"
          className={`mt-3 flex items-center rounded-xl py-2.5 transition-colors duration-150 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          }`}
          aria-label="Go to your profile"
          title={collapsed ? `${user?.name ?? 'User'} profile` : undefined}
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
      </div>
    </aside>
  );
}

export default DashboardSidebar;
