import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "../Container";

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Partner data — icon + name
───────────────────────────────────────── */
const partners = [
  {
    name: "MIT",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="5" width="3" height="8" rx="1" fill="currentColor" />
        <rect x="9"  y="5" width="5" height="2" rx="1" fill="currentColor" />
        <rect x="9"  y="9" width="4" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "FreeCodeCamp",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 13V5M13 13V5M5 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Khan Academy",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2L16 6v6l-7 4-7-4V6L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="9" cy="9" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Coursera",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Duolingo",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2c3.866 0 7 3.134 7 7s-3.134 7-7 7S2 12.866 2 9s3.134-7 7-7z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.5 10c.5 1.5 4.5 1.5 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="6.5" cy="7.5" r="1" fill="currentColor" />
        <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "MDN Web Docs",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8l2 2 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "W3Schools",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h4M9 9c0-1.1.9-2 2-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "GitHub Education",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 1.5a7.5 7.5 0 0 0-2.372 14.615c.375.07.512-.163.512-.361 0-.178-.007-.773-.01-1.397-2.086.453-2.526-.888-2.526-.888-.341-.866-.833-1.097-.833-1.097-.68-.465.052-.455.052-.455.752.053 1.147.772 1.147.772.668 1.145 1.753.814 2.18.623.068-.484.261-.815.475-1.002-1.664-.19-3.414-.832-3.414-3.703 0-.818.292-1.486.771-2.01-.077-.19-.334-.95.073-1.98 0 0 .63-.201 2.062.768A7.18 7.18 0 0 1 9 5.908c.637.003 1.279.086 1.878.252 1.43-.97 2.059-.769 2.059-.769.408 1.031.151 1.791.074 1.98.48.524.77 1.192.77 2.01 0 2.879-1.753 3.512-3.422 3.697.269.232.508.69.508 1.39 0 1.003-.009 1.812-.009 2.058 0 .2.135.434.515.361A7.5 7.5 0 0 0 9 1.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "LeetCode",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="5" width="3" height="8" rx="1" fill="currentColor" />
        <rect x="9"  y="5" width="5" height="2" rx="1" fill="currentColor" />
        <rect x="9"  y="9" width="4" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "CodeChef",
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="currentColor" />
      </svg>
    ),
  },    
];

/* ─────────────────────────────────────────
   PartnerCard — pill with icon + name
───────────────────────────────────────── */
function PartnerCard({ name, Icon }) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.04,
        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        backgroundColor: "#ffffff",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      className="mx-3 inline-flex cursor-default select-none items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
      aria-label={name}
      title={name}
    >
      {/* Monochrome icon */}
      <span className="shrink-0 text-neutral-500 transition-colors duration-200 group-hover:text-neutral-900">
        <Icon />
      </span>
      {/* Name */}
      <span className="whitespace-nowrap text-[13.5px] font-semibold tracking-tight text-neutral-600 transition-colors duration-200 group-hover:text-neutral-950">
        {name}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Marquee track — pure CSS animation,
   Framer Motion only for hover-pause.
   Duplicated list ensures a seamless loop
   with zero visible jump.
───────────────────────────────────────── */
function MarqueeTrack({ inView }) {
  /* We render the list twice so the second
     copy tiles seamlessly after the first. */
  const list = [...partners, ...partners];

  return (
    /*
      Outer: overflow-hidden clips the track.
      Two edge fade masks via a CSS mask-image
      so cards fade out gracefully at the edges.
    */
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex w-max"
        /* Hover pauses the CSS animation via a
           CSS custom property, no JS interval. */
        whileHover="paused"
        style={{
          /* The animation runs on the inner element
             via a CSS class, not Framer keyframes,
             so it is always linear and never restarts. */
        }}
      >
        {/* The actual scrolling rail — CSS animation */}
        <motion.div
          className="marquee-rail flex items-center"
          variants={{
            paused: { animationPlayState: "paused" },
          }}
          style={{
            animation: inView
              ? "marquee-scroll 38s linear infinite"
              : "none",
          }}
        >
          {list.map((p, i) => (
            <PartnerCard key={`${p.name}-${i}`} name={p.name} Icon={p.Icon} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/*   Partners Section   */
function Partners() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#fafafa] py-24 lg:py-28"
      aria-labelledby="partners-heading"
    >
      {/* ── Keyframe definition ── */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Subtle radial glow behind the marquee ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
      >
        {/* Central soft glow */}
        <div
          className="mx-auto h-64 w-150 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.04) 0%, transparent 70%)" }}
        />
      </div>

      {/* ── Low-opacity decorative blurred circles ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-neutral-200 opacity-30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-neutral-200 opacity-30 blur-3xl"
      />

      {/* ── Edge hairlines ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />

      <Container>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="mb-12 text-center"
        >
          <h2
            id="partners-heading"
            className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            INSPIRATION
          </h2>
          <p className="text-[14.5px] leading-relaxed text-neutral-400">
            Inspired by the world&apos;s leading learning institutions and educational platforms.
          </p>
        </motion.div>
      </Container>

      {/* ── Marquee — full bleed, outside Container ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="relative"
        role="list"
        aria-label="Trusted learning institutions and platforms"
      >
        <MarqueeTrack inView={inView} />
      </motion.div>
    </section>
  );
}

export default Partners;
