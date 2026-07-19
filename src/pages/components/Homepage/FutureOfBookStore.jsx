import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "../../../components/Container";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Roadmap data
───────────────────────────────────────── */
const roadmap = [
  {
    number: "01",
    title: "Today",
    description:
      "Trusted, carefully selected books organized in one clean platform.",
  },
  {
    number: "02",
    title: "Next",
    description:
      "Personal libraries, smarter discovery, reading progress and richer organization.",
  },
  {
    number: "03",
    title: "Future",
    description:
      "Community recommendations, expert collections and even more ways to discover quality learning resources.",
  },
];

/* ─────────────────────────────────────────
   RoadmapItem
───────────────────────────────────────── */
function RoadmapItem({ item, index, inView, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.15 + index * 0.13, ease }}
      className="relative flex gap-6"
    >
      {/* Left — badge + connector line */}
      <div className="flex flex-col items-center">
        {/* Numbered circle badge */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          aria-hidden="true"
        >
          <span className="text-[12px] font-bold tracking-tight text-neutral-900">
            {item.number}
          </span>
        </motion.div>

        {/* Connector line — hidden on last item */}
        {!isLast && (
          <div
            aria-hidden="true"
            className="mt-2 w-px flex-1 bg-linear-to-b from-neutral-300 to-transparent"
          />
        )}
      </div>

      {/* Right — card */}
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          borderColor: "#a3a3a3",
          transition: { duration: 0.24, ease: "easeOut" },
        }}
        className="mb-6 flex-1 cursor-default rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-colors duration-300"
      >
        {/* Phase label */}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {item.phase}
        </p>
        {/* Title */}
        <h3 className="mb-2.5 text-[17px] font-bold tracking-tight text-neutral-950">
          {item.title}
        </h3>
        {/* Description */}
        <p className="text-[14.5px] leading-[1.75] text-neutral-500">
          {item.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FutureOfBookStore Section
───────────────────────────────────────── */
function FutureOfBookStore() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-28 lg:py-32"
      aria-labelledby="future-heading"
    >
      {/* Dot-grid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="future-dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#future-dot-grid)" />
      </svg>

      {/* Edge hairlines */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">

          {/* ── LEFT — text ── */}
          <div className="lg:sticky lg:top-32">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.0, ease }}
              className="mb-5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
            >
              The Future of BookStore
            </motion.p>

            {/* Heading */}
            <motion.h2
              id="future-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.1, ease }}
              className="mb-7 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Books are only
              <br />the beginning.
            </motion.h2>

            {/* Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="max-w-110 space-y-4 text-[1.0625rem] leading-[1.78] text-neutral-500"
            >
              <p>
                BookStore starts with carefully selected, trusted books for
                technology learners.
              </p>
              <p>
                As we grow, we&apos;ll continue adding carefully curated learning
                resources, improved discovery tools, better organization and
                community-driven recommendations — while keeping our promise of
                quality, simplicity and trust.
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT — roadmap ── */}
          <div className="flex flex-col pt-1">
            {roadmap.map((item, i) => (
              <RoadmapItem
                key={item.number}
                item={item}
                index={i}
                inView={inView}
                isLast={i === roadmap.length - 1}
              />
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}

export default FutureOfBookStore;