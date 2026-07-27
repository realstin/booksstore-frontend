import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, ArrowRight, ArrowLeft,
  Rocket, BookOpen, Bookmark, Download,
  UserCircle, Library, ChevronDown,
  MessageCircle, UserPlus, Compass, BookMarked,
} from "lucide-react";
import Container from "../../components/Container";
import Navbar from "../../components/Homepage/Navbar";
import Footer from "../../components/Homepage/Footer";

/* ─────────────────────────────────────────
   Shared easing (matches rest of app)
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.68, delay, ease },
});

const inFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay, ease },
});

/* ─────────────────────────────────────────
   Dot-grid background
───────────────────────────────────────── */
function DotGrid({ id }) {
  return (
    <svg aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Hairlines() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
    </>
  );
}

/* ─────────────────────────────────────────
   DATA — Help topics
───────────────────────────────────────── */
const helpTopics = [
  {
    icon: Rocket,
    title: "Getting Started",
    desc: "Learn the basics of BookStore and set up your account in minutes.",
    anchor: "getting-started",
  },
  {
    icon: Search,
    title: "Finding Books",
    desc: "Discover how to search, browse, and find books that match your learning goals.",
    anchor: "faq",
  },
  {
    icon: Library,
    title: "My Library",
    desc: "Understand how your personal library works and how to organize saved books.",
    anchor: "faq",
  },
  {
    icon: BookOpen,
    title: "Reading Books",
    desc: "Learn about the BookStore online reading experience and how to use it comfortably.",
    anchor: "faq",
  },
  {
    icon: UserCircle,
    title: "Account & Profile",
    desc: "Manage your account details, profile settings, and personal information.",
    anchor: "faq",
  },
  {
    icon: Download,
    title: "Downloads",
    desc: "Learn how to download books for offline reading when you need access without the internet.",
    anchor: "faq",
  },
];

/* ─────────────────────────────────────────
   DATA — Getting started steps
───────────────────────────────────────── */
const gettingStartedSteps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create an Account",
    desc: "Sign up for BookStore to unlock your personal library and save books you want to return to.",
  },
  {
    num: "02",
    icon: Compass,
    title: "Discover Books",
    desc: "Browse trusted, carefully selected technology books organized by category and community interest.",
  },
  {
    num: "03",
    icon: BookMarked,
    title: "Build Your Library",
    desc: "Save books you find valuable so you can easily find them later and build your personal learning collection.",
  },
];

/* ─────────────────────────────────────────
   DATA — FAQs
───────────────────────────────────────── */
const faqs = [
  {
    q: "What is BookStore?",
    a: "BookStore is a platform built to help learners discover trusted, up-to-date technology books in one organized place. Instead of spending hours searching across different websites, you can find carefully selected books that are worth your time.",
  },
  {
    q: "How do I create an account?",
    a: "Click the \"Get Started\" button in the top navigation bar or visit the Sign Up page. Enter your details and you will have access to your personal BookStore library right away.",
  },
  {
    q: "How do I find books?",
    a: "Use the search bar to find books by title, author, or topic. You can also browse by category — such as Programming, AI, Backend, Frontend, DevOps, and more — or explore Community Favorites to see what other learners are reading.",
  },
  {
    q: "How do I save a book?",
    a: "When you find a book you want to keep, click the bookmark or Save button on the book card or book page. The book will be added to your personal library so you can return to it at any time.",
  },
  {
    q: "What is My Library?",
    a: "My Library is your personal collection of saved books inside BookStore. Every book you save appears here, making it easy to organize your learning resources and continue where you left off.",
  },
  {
    q: "Can I read books online?",
    a: "Yes. BookStore provides an online reading experience designed for focused learning — with clean typography, comfortable spacing, and a distraction-free interface built to keep you engaged.",
  },
  {
    q: "Can I download books?",
    a: "Download functionality is designed to let you access books offline when internet access is not available. Check individual book pages to see whether a download option is available for a specific title.",
  },
  {
    q: "Does BookStore have advertisements?",
    a: "No. BookStore is built around a focused, distraction-free learning experience. There are no advertisements on the platform. Our goal is to keep your attention on what matters — the books and your learning.",
  },
];

/* ─────────────────────────────────────────
   HERO with search
───────────────────────────────────────── */
function Hero({ query, onQuery, heroRef, heroInView }) {
  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-neutral-100 bg-white py-20 lg:py-28"
      aria-labelledby="help-heading"
    >
      <DotGrid id="help-hero-grid" />

      {/* Floating circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[6%] top-[25%] h-3 w-3 rounded-full border border-neutral-300" />
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute right-[8%] top-[30%] h-4 w-4 rounded-full border border-neutral-200" />
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          className="absolute right-[18%] bottom-[20%] h-2 w-2 rounded-full bg-neutral-300" />
      </div>

      <Container>
        {/* Back to home */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <Link
            to="/homepage"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to Home
          </Link>
        </motion.div>

        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <motion.p {...fadeUp(0.06)}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Help Center
          </motion.p>

          {/* Heading */}
          <motion.h1 id="help-heading" {...fadeUp(0.13)}
            className="mb-5 text-[clamp(2.4rem,5vw,3.6rem)] font-bold leading-[1.07] tracking-[-0.025em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            How can we help?
          </motion.h1>

          {/* Subheading */}
          <motion.p {...fadeUp(0.2)}
            className="mb-10 text-[1.0625rem] leading-[1.78] text-neutral-500">
            Find answers, guides, and helpful information about using BookStore.
          </motion.p>

          {/* Search bar */}
          <motion.div {...fadeUp(0.28)} className="relative">
            <Search
              size={17}
              strokeWidth={2}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search for help, guides, and answers..."
              aria-label="Search the Help Center"
              className="h-14 w-full rounded-2xl border border-neutral-200 bg-white pl-12 pr-5 text-[15px] text-neutral-900 placeholder-neutral-400 shadow-[0_2px_12px_rgba(0,0,0,0.06)] outline-none transition-all duration-200 focus:border-neutral-400 focus:shadow-[0_4px_20px_rgba(0,0,0,0.09)] focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   SEARCH RESULTS
───────────────────────────────────────── */
function SearchResults({ query, onClear }) {
  const q = query.toLowerCase().trim();

  const matchedTopics = helpTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q)
  );

  const matchedFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(q) ||
      f.a.toLowerCase().includes(q)
  );

  const hasResults = matchedTopics.length > 0 || matchedFaqs.length > 0;

  return (
    <section className="relative bg-white py-12 lg:py-16" aria-label="Search results">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <p className="text-[15px] font-semibold text-neutral-700">
            {hasResults
              ? `Results for "${query}"`
              : `No results for "${query}"`}
          </p>
          <button
            onClick={onClear}
            className="text-[13.5px] font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-950 focus:outline-none"
          >
            Clear search
          </button>
        </div>

        {!hasResults && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search size={36} className="text-neutral-300" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-[15px] font-semibold text-neutral-700">No results found.</p>
            <p className="max-w-xs text-[14px] text-neutral-400">
              Try a different search term, or{" "}
              <Link to="/contact" className="font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-950">
                contact our team
              </Link>{" "}
              for help.
            </p>
          </div>
        )}

        {matchedTopics.length > 0 && (
          <div className="mb-10">
            <p className="mb-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Help Topics</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchedTopics.map((t) => (
                <a key={t.title} href={`#${t.anchor}`}
                  className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-neutral-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-neutral-100">
                    <t.icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-neutral-900 group-hover:text-neutral-700">{t.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-neutral-400">{t.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {matchedFaqs.length > 0 && (
          <div>
            <p className="mb-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-400">FAQ Answers</p>
            <div className="flex flex-col gap-3">
              {matchedFaqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <p className="mb-2 text-[15px] font-semibold text-neutral-900">{f.q}</p>
                  <p className="text-[14px] leading-[1.75] text-neutral-500">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   POPULAR TOPICS
───────────────────────────────────────── */
function PopularTopics() {
  return (
    <section id="topics" className="relative overflow-hidden bg-white py-20 lg:py-24" aria-labelledby="topics-heading">
      <DotGrid id="topics-grid" />
      <Hairlines />
      <Container>
        <motion.div {...inFadeUp(0)} className="mb-12 text-center">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Browse Topics</p>
          <h2 id="topics-heading"
            className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            Popular Topics
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {helpTopics.map((topic, i) => (
            <motion.a
              key={topic.title}
              href={`#${topic.anchor}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
              className="group flex cursor-pointer items-start gap-5 rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_10px_32px_rgba(0,0,0,0.07)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              aria-label={topic.title}
            >
              {/* Icon */}
              <span className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700 transition-all duration-300 group-hover:border-neutral-200 group-hover:bg-neutral-100">
                <topic.icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </span>

              {/* Text + arrow */}
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                    {topic.title}
                  </h3>
                  <ArrowRight
                    size={15}
                    className="flex-shrink-0 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-neutral-700"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[13.5px] leading-[1.7] text-neutral-400">{topic.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   GETTING STARTED
───────────────────────────────────────── */
function GettingStarted() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <section id="getting-started" ref={ref}
      className="relative overflow-hidden bg-neutral-50/60 py-20 lg:py-24"
      aria-labelledby="gs-heading">
      <Hairlines />
      <Container>
        <motion.div {...inFadeUp(0)} className="mb-14 text-center">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Step by step</p>
          <h2 id="gs-heading"
            className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-neutral-950"
            style={{ fontFamily: "var(--font-sans)" }}>
            Getting Started with BookStore
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Connecting line — desktop only */}
          <div aria-hidden="true"
            className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 lg:block" />

          {gettingStartedSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.14, ease }}
              className="relative flex flex-col items-center gap-5 text-center lg:items-start lg:text-left"
            >
              {/* Number circle */}
              <div className="relative z-10 flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full border-2 border-neutral-900 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <step.icon size={20} strokeWidth={1.75} className="text-neutral-800" aria-hidden="true" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">{step.num}</span>
                <h3 className="text-[16px] font-bold tracking-tight text-neutral-950">{step.title}</h3>
                <p className="text-[14px] leading-[1.75] text-neutral-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...inFadeUp(0.42)} className="mt-12 flex justify-center">
          <Link to="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-8 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            Create Your Account
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
      >
        <span className="text-[15px] font-semibold text-neutral-900">{faq.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="flex-shrink-0 text-neutral-400"
          aria-hidden="true"
        >
          <ChevronDown size={18} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14.5px] leading-[1.8] text-neutral-500">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="relative overflow-hidden bg-white py-20 lg:py-24 scroll-mt-24" aria-labelledby="faq-heading">
      <DotGrid id="faq-grid" />
      <Hairlines />
      <Container>
        <div className="mx-auto max-w-2xl">
          <motion.div {...inFadeUp(0)} className="mb-12 text-center">
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">FAQ</p>
            <h2 id="faq-heading"
              className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div {...inFadeUp(0.1)}
            className="rounded-2xl border border-neutral-200 bg-white px-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
            role="list"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.q}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   STILL NEED HELP — final CTA
───────────────────────────────────────── */
function StillNeedHelp() {
  return (
    <section
      className="relative overflow-hidden bg-neutral-50/60 py-20 lg:py-24"
      aria-labelledby="still-help-heading"
    >
      <Hairlines />
      <Container>
        <motion.div
          {...inFadeUp(0)}
          className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center"
        >
          {/* Animated icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
            aria-hidden="true"
          >
            <MessageCircle size={26} strokeWidth={1.6} className="text-neutral-700" />
          </motion.div>

          <div className="flex flex-col gap-2">
            <h2
              id="still-help-heading"
              className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Still need help?
            </h2>
            <p className="text-[15px] leading-relaxed text-neutral-500">
              Can&apos;t find what you&apos;re looking for? Our team is here to help.
            </p>
          </div>

          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-8 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Contact Us
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────
   ROOT — Help Center page
───────────────────────────────────────── */
function Help() {
  const [query, setQuery] = useState("");
  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <div className="h-20" aria-hidden="true" />

      <Hero
        query={query}
        onQuery={setQuery}
        heroRef={heroRef}
        heroInView={heroInView}
      />

      {isSearching ? (
        <SearchResults query={query} onClear={() => setQuery("")} />
      ) : (
        <>
          <PopularTopics />
          <GettingStarted />
          <FAQ />
          <StillNeedHelp />
        </>
      )}

      <Footer />
    </div>
  );
}

export default Help;
