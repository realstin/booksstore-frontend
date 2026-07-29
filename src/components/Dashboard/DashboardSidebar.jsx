import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Library,
  User, Settings, LogOut, Loader2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardNavItem from './DashboardNavItem';
import bookstoreLogo from '../../assets/bookstorelogo.svg';

const primaryNav = [
  { to: '/dashboard',          label: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/dashboard/explore',  label: 'Explore',    icon: Compass },
  { to: '/dashboard/library',  label: 'My Library', icon: Library },
  { to: '/dashboard/profile',  label: 'Profile',    icon: User },
  { to: '/dashboard/settings', label: 'Settings',   icon: Settings },
];

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

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className="flex h-full w-64 flex-col border-r border-neutral-200 bg-white"
      aria-label="Dashboard navigation"
    >
      {/* ── Brand ── */}
      <div className="flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-neutral-100 px-5">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label="BookStore dashboard home"
        >
          <img
            src={bookstoreLogo}
            alt="BookStore"
            className="h-6 w-6 flex-shrink-0"
          />
          <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
            BookStore
          </span>
        </Link>
      </div>

      {/* ── Primary nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="list">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <DashboardNavItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                end={item.end}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User area + logout ── */}
      <div className="flex-shrink-0 border-t border-neutral-100 px-3 py-4">
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
            <Loader2 size={17} strokeWidth={2} className="animate-spin flex-shrink-0" aria-hidden="true" />
          ) : (
            <LogOut size={17} strokeWidth={1.9} className="flex-shrink-0" aria-hidden="true" />
          )}
          <span>{loggingOut ? 'Logging out…' : 'Log out'}</span>
        </button>

        {/* User card */}
        <Link
          to="/dashboard/profile"
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label="Go to your profile"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white">
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
    </aside>
  );
}

export default DashboardSidebar;
