import { motion } from 'framer-motion';
import {
  BookOpen, BookMarked, TrendingUp, Clock, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease },
});

/* ─────────────────────────────────────────
   Empty state card used inside placeholder sections
───────────────────────────────────────── */
function EmptyCard({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-10 text-center">
      <Icon size={28} strokeWidth={1.4} className="text-neutral-300" aria-hidden="true" />
      <p className="text-[13.5px] text-neutral-400">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Section wrapper with heading
───────────────────────────────────────── */
function Section({ title, delay, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58, delay, ease }}
      aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <h2
        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="mb-4 text-[13.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400"
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────
   Dashboard home page
───────────────────────────────────────── */
function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Welcome header ── */}
      <header className="mb-10">
        <motion.p
          {...fadeUp(0)}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
        >
          Dashboard
        </motion.p>
        <motion.h1
          {...fadeUp(0.07)}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
        >
          Welcome back, {firstName}.
        </motion.h1>
        <motion.p
          {...fadeUp(0.13)}
          className="max-w-lg text-[1rem] leading-[1.75] text-neutral-500"
        >
          Continue your learning journey, discover something new, and build
          your personal library.
        </motion.p>
      </header>

      {/* ── Sections grid ── */}
      <div className="flex flex-col gap-10">

        {/* Continue Reading */}
        <Section title="Continue Reading" delay={0.18}>
          <EmptyCard
            icon={BookOpen}
            message="Books you begin reading will appear here."
          />
        </Section>

        {/* Recently Added */}
        <Section title="Recently Added" delay={0.24}>
          <EmptyCard
            icon={Sparkles}
            message="Newly added books will appear here as the library grows."
          />
        </Section>

        {/* Two-column row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Trending Books */}
          <Section title="Trending Books" delay={0.3}>
            <EmptyCard
              icon={TrendingUp}
              message="Community favourites will appear here."
            />
          </Section>

          {/* Recent Activity */}
          <Section title="Recent Activity" delay={0.36}>
            <EmptyCard
              icon={Clock}
              message="Your reading activity will be tracked here."
            />
          </Section>

        </div>

        {/* Saved / Library */}
        <Section title="Saved Books" delay={0.4}>
          <EmptyCard
            icon={BookMarked}
            message="Your reading journey starts here. Save books to your library and they will appear in this section."
          />
        </Section>

      </div>
    </div>
  );
}

export default Dashboard;
