import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "../../../components/Container";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Partner data
   — text-only wordmarks, monochrome
───────────────────────────────────────── */
const partners = [
  { name: "MIT",                  label: "MIT" },
  { name: "Harvard University",   label: "Harvard" },
  { name: "Stanford University",  label: "Stanford" },
  { name: "Coursera",             label: "Coursera" },
  { name: "Duolingo",             label: "Duolingo" },
  { name: "ALU",                  label: "ALU" },
  { name: "Rwanda Coding Academy",label: "RCA" },
];

/* ─────────────────────────────────────────
   PartnerLogo — text wordmark
───────────────────────────────────────── */
function PartnerLogo({ name, label, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease }}
      whileHover={{ y: -3, opacity: 1, transition: { duration: 0.2 } }}
      className="group flex cursor-default items-center justify-center px-4 opacity-35 transition-opacity duration-300 hover:opacity-100"
      aria-label={name}
      title={name}
    >
      <span
        className="whitespace-nowrap text-[15px] font-bold tracking-tight text-neutral-950 transition-colors duration-300"
        aria-hidden="true"
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Partners / Trusted Learning Ecosystem
───────────────────────────────────────── */
function Partners() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-24 lg:py-28"
      aria-labelledby="partners-heading"
    >
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

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-14 text-center"
        >
          <p
            id="partners-heading"
            className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
          >
            Trusted Learning Ecosystem
          </p>
        </motion.div>

        {/* Logo row */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 lg:gap-x-14"
          role="list"
          aria-label="Trusted organizations and institutions"
        >
          {partners.map((p, i) => (
            <div key={p.name} role="listitem">
              <PartnerLogo
                name={p.name}
                label={p.label}
                index={i}
                inView={inView}
              />
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}

export default Partners;
