import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bookmark, Search, BookOpen } from "lucide-react";
import Container from "../Container";

const ease = [0.22, 1, 0.36, 1];

/*
  Three focused feature tiles.
  Short label — one line description.
  No long paragraphs, no dense text.
*/
const features = [
  {
    icon:        Bookmark,
    title:       "Save & Organise",
    description: "Build your personal library. Save any book, access it anytime.",
  },
  {
    icon:        Search,
    title:       "Smart Discovery",
    description: "Find what you need fast — search, filter, and explore by category.",
  },
  {
    icon:        BookOpen,
    title:       "Read Without Distraction",
    description: "A clean, focused reader with no ads, no clutter — just the book.",
  },
];

function FeatureTile({ icon: Icon, title, description, index, inView }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.68, delay: index * 0.12, ease }}
      whileHover={{ y: -5, transition: { duration: 0.24, ease: "easeOut" } }}
      className="group flex cursor-default flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-10 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
      aria-label={`${title} — ${description}`}
    >
      {/* Icon — dark square */}
      <motion.span
        whileHover={{ scale: 1.05, rotate: 6 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.75} />
      </motion.span>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[16px] font-semibold tracking-tight text-neutral-900">
          {title}
        </h3>
        <p className="text-[14px] leading-[1.75] text-neutral-400">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

function Features() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-28 scroll-mt-20"
      aria-labelledby="features-heading"
    >
      {/* Edge hairlines */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>

        {/* Header — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="mb-16 max-w-lg"
        >
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Features
          </p>
          <h2
            id="features-heading"
            className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
          >
            Everything you need.
            <br />
            <span className="text-neutral-400">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Three tiles */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <FeatureTile
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
              index={i}
              inView={inView}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}

export default Features;
