import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.68, delay, ease },
});

function Dashboard() {
  const { user } = useAuth();

  // Use first name only for a friendlier greeting.
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Dot-grid background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dash-dot-grid"
            x="0" y="0" width="28" height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dash-dot-grid)" />
      </svg>

      {/* Minimal top bar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <BookOpen size={20} strokeWidth={1.75} className="text-neutral-950" aria-hidden="true" />
            <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
              BookStore
            </span>
          </Link>

          {/* Logout */}
          <Link
            to="/logout"
            className="text-[14px] font-medium text-neutral-500 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:text-neutral-950"
          >
            Log out
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="flex max-w-xl flex-col items-center gap-6 text-center">

          {/* Icon */}
          <motion.div
            {...fadeUp(0)}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          >
            <BookOpen size={26} strokeWidth={1.5} className="text-neutral-700" aria-hidden="true" />
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            {...fadeUp(0.08)}
            className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            Your Dashboard
          </motion.p>

          {/* Heading */}
          <motion.h1
            {...fadeUp(0.14)}
            className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-neutral-950"
          >
            Welcome back, {firstName}.
          </motion.h1>

          {/* Description */}
          <motion.p
            {...fadeUp(0.22)}
            className="text-[1.0625rem] leading-[1.78] text-neutral-500"
          >
            This is your personal learning workspace. Your library, your saved
            books, and your reading progress will all live here.
          </motion.p>

          {/* Small note */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-[13px] text-neutral-400"
          >
            More features are coming soon.
          </motion.p>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
