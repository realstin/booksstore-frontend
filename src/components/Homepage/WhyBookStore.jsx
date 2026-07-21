import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, RefreshCw, Library, Focus } from "lucide-react";
import Container from "../Container";

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Books",
    description:
      "Every book is carefully reviewed and selected so learners can confidently build real skills using reliable resources.",
  },
  {
    icon: RefreshCw,
    title: "Always Up-to-Date",
    description:
      "Find both the latest editions and valuable previous editions so you can learn modern technologies with confidence.",
  },
  {
    icon: Library,
    title: "Organized Learning",
    description:
      "Books are categorized, searchable and easy to discover, helping you find the right resource faster.",
  },
  {
    icon: Focus,
    title: "Built for Focus",
    description:
      "No advertisements. No unnecessary distractions. Just a calm reading experience designed to help you stay focused.",
  },
];

/* ─────────────────────────────────────────
   Animation variants
───────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ─────────────────────────────────────────
   FeatureCard
───────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.28, ease: "easeOut" },
      }}
      className="group flex cursor-default flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.07)]"
      aria-label={`${title} — ${description}`}
    >
      {/* Icon tile */}
      <span
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-all duration-300 group-hover:border-neutral-200 group-hover:bg-neutral-100"
        aria-hidden="true"
      >
        <motion.span
          whileHover={{ rotate: 12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Icon size={20} strokeWidth={1.75} />
        </motion.span>
      </span>

      {/* Text */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-neutral-900">
          {title}
        </h3>
        <p className="text-[14px] leading-[1.75] text-neutral-400">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────
   WhyBookStore Section
───────────────────────────────────────── */
function WhyBookStore() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-28 lg:py-32"
      aria-labelledby="why-heading"
    >
      {/* Subtle dot-grid background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="why-dot-grid"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#why-dot-grid)" />
      </svg>

      {/* Very faint top edge divider */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      <Container>
        {/* Section header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mb-16 text-center"
        >
          {/* Label */}
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Why BookStore
          </p>

          {/* Heading */}
          <h2
            id="why-heading"
            className="mb-5 text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold tracking-tight text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Why Choose BookStore?
          </h2>

          {/* Description */}
          <p className="mx-auto max-w-170 text-[1.0625rem] leading-[1.75] text-neutral-500">
            Finding trustworthy technology books shouldn&apos;t be difficult.
            BookStore carefully organizes verified and up-to-date books so you
            can spend less time searching and more time learning.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default WhyBookStore;
