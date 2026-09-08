import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ceoImage from "../../assets/ceo.png";

const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Social icons
───────────────────────────────────────── */
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.6 1h2.4L9.6 7l6 8H10L6.4 9.8 2.2 15H0l5.8-6.5L.2 1H5l3.2 4.7L12.6 1zm-.9 12.6h1.3L4.4 2.3H3L11.7 13.6z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="M8 1c-2 2.5-2 9.5 0 14M8 1c2 2.5 2 9.5 0 14M1 8h14" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Team member data
───────────────────────────────────────── */
const member = {
  name:    "IRATUZI M. Justin",
  role:    "CEO & Founder",
  bio:     "Builder and visionary behind BookStore. Passionate about helping learners discover trusted technology resources — faster and smarter.",
  socials: [
    { label: "X (Twitter)", href: "https://x.com/irmjustin",            Icon: XIcon     },
    { label: "GitHub",      href: "https://github.com/realstin",        Icon: GitHubIcon },
    { label: "Website",     href: "https://irmjustin.github.io/",       Icon: GlobeIcon  },
  ],
};

/* ─────────────────────────────────────────
   Team Page
───────────────────────────────────────── */
function Team() {
  const pageRef = useRef(null);
  const inView  = useInView(pageRef, { once: true });

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Subtle dot grid */}
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

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          className="mb-20"
        >
          <Link
            to="/"
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
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.04, ease }}
          className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-neutral-400"
        >
          Our Team
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.72, delay: 0.1, ease }}
          className="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.07] tracking-[-0.025em] text-neutral-950"
        >
          A growing team with
          <br className="hidden sm:block" />
          <span className="text-neutral-400"> a shared vision.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.68, delay: 0.18, ease }}
          className="mb-24 max-w-lg text-[1.0625rem] leading-[1.78] text-neutral-500"
        >
          BookStore is built by a focused team on a single mission —
          making trusted learning resources easier to find for every developer.
        </motion.p>

        {/* ── Member row — free layout, no card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.28, ease }}
          className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:gap-14"
          aria-label={`${member.name}, ${member.role}`}
        >
          {/* Circular photo — medium size, clean */}
          <div className="relative shrink-0">
            {/* Outer decorative ring */}
            <div
              className="absolute -inset-[3px] rounded-full"
              style={{
                background: "linear-gradient(135deg, #0f1419 0%, rgba(15,20,25,0.12) 60%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative h-44 w-44 overflow-hidden rounded-full ring-4 ring-white">
              <img
                src={ceoImage}
                alt={`${member.name} — ${member.role}`}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Info — free, no box */}
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-[1.35rem] font-bold tracking-tight text-neutral-950">
                {member.name}
              </h2>
              <p className="mt-1 text-[13.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {member.role}
              </p>
            </div>

            <p className="max-w-sm text-[14.5px] leading-[1.75] text-neutral-500">
              {member.bio}
            </p>

            {/* Socials — inline, label + icon buttons */}
            <div className="flex items-center gap-1.5">
              <span className="mr-2 text-[12.5px] font-medium text-neutral-400">
                Follow on
              </span>
              {member.socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label={`${member.name} on ${label}`}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Thin divider ── */}
        <div className="my-24 h-px bg-neutral-100" aria-hidden="true" />

        {/* ── Hiring note — free, no heavy card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.42, ease }}
          className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-2">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              We're growing
            </p>
            <h3 className="text-[1.2rem] font-bold tracking-tight text-neutral-950">
              Want to join the team?
            </h3>
            <p className="max-w-sm text-[14px] leading-relaxed text-neutral-500">
              Passionate about education and technology? We'd love to hear from you.
            </p>
          </div>

          <Link
            to="/contact"
            className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Get in Touch
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default Team;
