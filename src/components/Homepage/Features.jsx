import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bookmark,
  FileText,
  Download,
  Star,
  Search,
  BookOpen,
} from "lucide-react";
import Container from "../Container";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const features = [
  {
    icon: Bookmark,
    title: "Save Books",
    description:
      "Create your own personal online library by saving books you want to revisit anytime.",
  },
  {
    icon: FileText,
    title: "Read Online",
    description:
      "Read books directly in a beautifully designed reader built for comfort and focus.",
  },
  {
    icon: Download,
    title: "Download Offline",
    description:
      "Download books when available so you can continue learning even without internet access.",
  },
  {
    icon: Star,
    title: "Favorites",
    description:
      "Mark books you love and help surface the resources readers find most valuable.",
  },
  {
    icon: Search,
    title: "Smart Discovery",
    description:
      "Find books quickly through organized categories, search and community recommendations.",
  },
  {
    icon: BookOpen,
    title: "Beautiful Reading Experience",
    description:
      "Enjoy clean typography, distraction-free layouts and a reading environment designed to help you stay focused.",
  },
];

/* ─────────────────────────────────────────
   Animation variants
───────────────────────────────────────── */
const headerVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────
   FeatureCard
───────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        transition: { duration: 0.26, ease: "easeOut" },
      }}
      className="group flex cursor-default flex-col gap-7 rounded-3xl border border-neutral-200 bg-white p-10 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
      aria-label={`${title} — ${description}`}
    >
      {/* Icon — black rounded square */}
      <motion.span
        whileHover={{ scale: 1.05, rotate: 6 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.75} />
      </motion.span>

      {/* Text */}
      <div className="flex flex-col gap-3">
        <motion.h3
          className="text-[16px] font-semibold leading-snug tracking-tight text-neutral-900 transition-transform duration-200 group-hover:-translate-y-0.5"
        >
          {title}
        </motion.h3>
        <p className="text-[14px] leading-[1.8] text-neutral-400">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   Features Section
───────────────────────────────────────── */
function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32 scroll-mt-20"
      aria-labelledby="features-heading"
    >
      {/* Subtle dot-grid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="features-dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#features-dot-grid)" />
      </svg>

      {/* Section edge hairlines */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      <Container>
        {/* ── Header ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mb-20 text-center"
        >
          {/* Eyebrow label */}
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Features
          </p>

          {/* Heading */}
          <h2
            id="features-heading"
            className="mb-5 text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Everything you need to build
            <br className="hidden sm:block" /> your learning library
          </h2>

          {/* Supporting paragraph */}
          <p className="mx-auto max-w-162.5 text-[1.0625rem] leading-[1.75] text-neutral-500">
            A calm, focused toolkit for readers who care about what they read.
          </p>
        </motion.div>

        {/* ── 2 × 3 Card grid ── */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default Features;
