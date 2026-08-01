import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Calendar,
  BookMarked, ChevronRight, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getLibrary } from '../../services/api';

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';
}

function formatMemberDate(raw) {
  if (!raw) return null;
  try {
    return new Date(raw).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return null;
  }
}

function capitalise(str) {
  if (!str) return '—';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ─────────────────────────────────────────
   Avatar — initials fallback, or real image
───────────────────────────────────────── */
function Avatar({ user, size = 'lg' }) {
  const initials = getInitials(user?.name);
  const dim      = size === 'lg' ? 'h-20 w-20 text-[1.5rem]' : 'h-12 w-12 text-[0.9rem]';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={`${user.name ?? 'User'}'s avatar`}
        className={`${dim} rounded-full object-cover shadow-[0_4px_16px_rgba(0,0,0,0.15)]`}
      />
    );
  }

  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-neutral-950 font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]`}
      aria-label={`Avatar for ${user?.name ?? 'User'}`}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────
   Info row — icon + label + value
───────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-4 py-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-500">
        <Icon size={14} strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
          {label}
        </span>
        <span className="truncate text-[14px] text-neutral-800">{value}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Profile page
───────────────────────────────────────── */
function Profile() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  /* Library count — best-effort, never crashes page */
  const [libCount,  setLibCount]  = useState(null);  // null = unknown
  const [libStatus, setLibStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data  = await getLibrary();
        const books = Array.isArray(data)
          ? data
          : data.savedBooks ?? data.books ?? [];
        if (!cancelled) {
          setLibCount(books.length);
          setLibStatus('success');
        }
      } catch {
        if (!cancelled) setLibStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const memberSince = formatMemberDate(user?.createdAt);

  /* Derived label for saved books */
  const libLabel =
    libStatus === 'loading'
      ? '—'
      : libStatus === 'error'
      ? 'Unavailable'
      : libCount === 1
      ? '1 saved book'
      : `${libCount} saved books`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Page heading ── */}
      <header className="mb-8">
        <motion.p {...fadeUp(0)}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Profile
        </motion.p>
        <motion.h1 {...fadeUp(0.07)}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
          Your Profile
        </motion.h1>
        <motion.p {...fadeUp(0.13)}
          className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500">
          Your account information and personal details.
        </motion.p>
      </header>

      <div className="flex flex-col gap-6">

        {/* ── Profile header card ── */}
        <motion.div {...fadeUp(0.18)}
          className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:flex-row sm:gap-6">
          <Avatar user={user} size="lg" />
          <div className="flex flex-col gap-1.5 text-center sm:text-left min-w-0">
            <h2 className="text-[1.3rem] font-bold tracking-tight text-neutral-950">
              {user?.name ?? '—'}
            </h2>
            <p className="truncate text-[14.5px] text-neutral-500">
              {user?.email ?? '—'}
            </p>
            {memberSince && (
              <p className="text-[13px] text-neutral-400">
                Member since {memberSince}
              </p>
            )}
            {user?.role && (
              <span className="self-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-0.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-neutral-500 sm:self-start">
                {capitalise(user.role)}
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Account information ── */}
        <motion.section {...fadeUp(0.24)} aria-labelledby="account-heading">
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <p id="account-heading"
              className="border-b border-neutral-100 py-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Account Information
            </p>
            <div className="divide-y divide-neutral-100">
              <InfoRow icon={User}     label="Name"         value={user?.name} />
              <InfoRow icon={Mail}     label="Email"        value={user?.email} />
              <InfoRow icon={Shield}   label="Role"         value={capitalise(user?.role)} />
              <InfoRow icon={Calendar} label="Member Since" value={memberSince} />
            </div>
          </div>
        </motion.section>

        {/* ── Library summary ── */}
        <motion.section {...fadeUp(0.3)} aria-labelledby="library-heading">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <p id="library-heading"
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                My Library
              </p>
            </div>
            <div className="flex items-center gap-4 px-6 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-600">
                <BookMarked size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold text-neutral-900">
                  {libLabel}
                </span>
                <span className="text-[12.5px] text-neutral-400">
                  Personal reading collection
                </span>
              </div>
              <motion.button
                type="button"
                onClick={() => navigate('/dashboard/library')}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                aria-label="View your library"
              >
                View Library
                <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* ── Edit Profile — deferred ── */}
        <motion.section {...fadeUp(0.36)} aria-labelledby="edit-heading">
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
            <p id="edit-heading"
              className="border-b border-neutral-100 py-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Edit Profile
            </p>
            <div className="py-6 text-center">
              <p className="text-[14px] text-neutral-500">
                Profile editing will be available in a future update.
              </p>
              <p className="mt-1 text-[12.5px] text-neutral-400">
                Name changes, avatar uploads, and email updates are coming soon.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Learning journey — future placeholder ── */}
        <motion.section {...fadeUp(0.42)} aria-labelledby="learning-heading">
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-8 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400">
                <TrendingUp size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p id="learning-heading"
                  className="mb-1 text-[14.5px] font-semibold text-neutral-700">
                  Your Learning Journey
                </p>
                <p className="max-w-xs text-[13.5px] leading-relaxed text-neutral-400">
                  Reading activity, learning streaks, and progress insights will
                  appear here as you continue learning.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default Profile;
