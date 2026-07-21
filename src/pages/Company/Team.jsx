import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

/* ─────────────────────────────────────────
   Team data
───────────────────────────────────────── */
const team = [
  {
    name: "IRATUZI M. Justin",
    role: "Full Stack Developer",
    bio: "Founder and sole builder of BookStore. Passionate about creating premium learning experiences that help developers find trusted technology books without wasting hours searching across the web.",
    initials: "IJ",
    socials: {
      x:         "https://x.com/irmjustin",
      github:    "https://github.com/realstin",
      portfolio: "#",
    },
  },
];

/* ─────────────────────────────────────────
   Social icons
───────────────────────────────────────── */
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.6 1h2.4L9.6 7l6 8H10L6.4 9.8 2.2 15H0l5.8-6.5L.2 1H5l3.2 4.7L12.6 1zm-.9 12.6h1.3L4.4 2.3H3L11.7 13.6z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 1c-2 2.5-2 9.5 0 14M8 1c2 2.5 2 9.5 0 14M1 8h14" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Member card
───────────────────────────────────────── */
function MemberCard({ member }) {
  return (
    <motion.article
      {...fadeUp(0.3)}
      whileHover={{ y: -6, transition: { duration: 0.26, ease: "easeOut" } }}
      className="group mx-auto flex w-full max-w-sm cursor-default flex-col items-center gap-8 rounded-3xl border border-neutral-200 bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
      aria-label={`${member.name}, ${member.role}`}
    >
      {/* Avatar */}
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute -inset-1 rounded-full border border-neutral-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-950 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <span className="text-[1.6rem] font-bold tracking-tight text-white">
            {member.initials}
          </span>
        </div>
        {/* Active indicator */}
        <span
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400"
          aria-label="Available"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">
          {member.name}
        </h2>
        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {member.role}
        </span>
        <p className="mt-2 max-w-[280px] text-[14px] leading-[1.75] text-neutral-500">
          {member.bio}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-neutral-100" aria-hidden="true" />

      {/* Socials */}
      <div className="flex items-center gap-3">
        {/* X / Twitter */}
        <motion.a
          href={member.socials.x}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12, y: -2 }}
          transition={{ duration: 0.18 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label={`${member.name} on X (Twitter)`}
        >
          <XIcon />
        </motion.a>

        {/* GitHub */}
        <motion.a
          href={member.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12, y: -2 }}
          transition={{ duration: 0.18 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label={`${member.name} on GitHub`}
        >
          <GitHubIcon />
        </motion.a>

        {/* Portfolio */}
        <motion.a
          href={member.socials.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12, y: -2 }}
          transition={{ duration: 0.18 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          aria-label={`${member.name}'s portfolio`}
        >
          <GlobeIcon />
        </motion.a>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Team Page
───────────────────────────────────────── */
function Team() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Subtle dot-grid background ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="team-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#team-dot-grid)" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-16">

        {/* ── Back to home ── */}
        <motion.div {...fadeUp(0)} className="mb-16">
          <Link
            to="/homepage"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Home
          </Link>
        </motion.div>

        {/* ── Page header ── */}
        <div className="mb-20 text-center">
          <motion.p
            {...fadeUp(0.05)}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            Our Team
          </motion.p>

          <motion.h1
            {...fadeUp(0.12)}
            className="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.025em] text-neutral-950"
          >
            Meet the leadership
            <br className="hidden sm:block" /> behind BookStore.
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mx-auto max-w-lg text-[1.0625rem] leading-[1.78] text-neutral-500"
          >
            BookStore is built by a small, focused team with a single goal — making
            it easier for learners everywhere to find books they can trust.
          </motion.p>
        </div>

        {/* ── Team grid ── */}
        <div className="flex justify-center">
          {team.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>

        {/* ── Hiring note ── */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-24 flex flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-neutral-50/60 px-8 py-12 text-center"
        >
          <span className="text-3xl" aria-hidden="true">🚀</span>
          <h3 className="text-[1.1rem] font-bold tracking-tight text-neutral-950">
            Want to join the team?
          </h3>
          <p className="max-w-sm text-[14.5px] leading-relaxed text-neutral-500">
            BookStore is growing. If you&apos;re passionate about education, technology
            and building things people love, we&apos;d love to hear from you.
          </p>
          <Link
            to="/contact"
            className="mt-2 inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-7 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Get in Touch
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default Team;
