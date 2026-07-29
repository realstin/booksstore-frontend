import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ease = [0.22, 1, 0.36, 1];

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function Profile() {
  const { user } = useAuth();
  const initials = getInitials(user?.name);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease }}
        className="flex flex-col gap-6"
      >
        <div>
          <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Profile
          </p>
          <h1 className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold tracking-[-0.02em] text-neutral-950">
            Your Profile
          </h1>
          <p className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500">
            Your account information and personal details.
          </p>
        </div>

        {/* User card */}
        <div className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[1.2rem] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
            {initials || <User size={22} aria-hidden="true" />}
          </div>
          <div>
            <p className="text-[1.05rem] font-bold text-neutral-950">{user?.name ?? '—'}</p>
            <p className="text-[14px] text-neutral-500">{user?.email ?? '—'}</p>
          </div>
        </div>

        {/* Placeholder */}
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-8 py-12 text-center">
          <User size={32} strokeWidth={1.25} className="mx-auto mb-4 text-neutral-300" aria-hidden="true" />
          <p className="text-[14px] text-neutral-400">
            Full profile editing and reading statistics are coming soon.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
