import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, HelpCircle } from "lucide-react";
import Container from "../../components/Container";
import Navbar from "../../components/Homepage/Navbar";
import Footer from "../../components/Homepage/Footer";

/* ─────────────────────────────────────────
   Config — update this single constant
   whenever the policy changes.
───────────────────────────────────────── */
const LAST_UPDATED = "July 27, 2026";
const CONTACT_EMAIL = "justiniratuzimbonyinshuti@gmail.com"; // replace with real email

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});
const inFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay, ease },
});

/* ─────────────────────────────────────────
   Policy sections data
   Keep all copy here so the JSX stays clean.
───────────────────────────────────────── */
const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: [
      `This Privacy Policy applies to the BookStore platform and describes how we handle information when you use our services. By using BookStore, you agree to the collection and use of information in accordance with this policy.`,
      `BookStore is a platform designed to help learners discover trusted, up-to-date technology books, build a personal reading library, read books online in a focused environment, and download books where available.`,
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    body: [
      `When you create a BookStore account, we collect basic account information such as your name and email address. This information is necessary to create and manage your account.`,
      `We also collect information related to how you use the platform, including the books you save to your personal library, the books you mark as favourites, and your general reading activity. This information helps us provide the core functionality of BookStore.`,
      `We may collect basic technical information necessary to operate and secure the service, such as information about your device, browser, and how you interact with the platform.`,
      `We only collect information that is necessary to provide the BookStore service. We do not collect information beyond what is described in this policy.`,
    ],
  },
  {
    id: "how-we-use-information",
    title: "3. How We Use Information",
    body: [
      `We use the information we collect to create and manage your BookStore account, provide access to platform features, and allow you to save books and manage your personal library.`,
      `Information may be used to improve and maintain the platform, identify and resolve technical issues, maintain security, and prevent misuse of the service.`,
      `We may use your email address to communicate with you about your account, service updates, or important changes to the platform when necessary.`,
      `We do not sell your personal information to third parties.`,
    ],
  },
  {
    id: "books-library-activity",
    title: "4. Books, Library, and User Activity",
    body: [
      `Information related to books you save, mark as favourites, or add to your personal library is used to provide you with the personalised BookStore experience, including your saved library and reading progress.`,
      `This activity information helps us understand how the platform is being used and improve the quality of the BookStore service over time.`,
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies, Local Storage, and Similar Technologies",
    body: [
      `BookStore may use technologies such as cookies or browser local storage where necessary for authentication, session management, and essential platform functionality.`,
      `These technologies are used only to the extent required to operate the service. We do not use cookies or local storage for advertising or tracking purposes unrelated to the BookStore service.`,
    ],
  },
  {
    id: "external-services",
    title: "6. Book Content and External Services",
    body: [
      `Some book files, resources, or platform features may be provided or hosted by third-party services where applicable. These external services may have their own privacy policies and terms of service.`,
      `BookStore is not responsible for the privacy practices of external services. We encourage you to review the privacy policies of any third-party services you interact with.`,
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security",
    body: [
      `BookStore takes reasonable technical and organisational measures to protect your personal information and maintain the security of the platform.`,
      `While we work to protect your information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, but we are committed to maintaining appropriate safeguards.`,
    ],
  },
  {
    id: "data-retention",
    title: "8. Data Retention",
    body: [
      `We retain your information for as long as your account is active and as long as necessary to provide the BookStore service.`,
      `Information may also be retained where required to comply with legal obligations, resolve disputes, prevent abuse, or enforce our agreements, as applicable.`,
      `You may request deletion of your account and associated information by contacting us. See the Contact section below for details.`,
    ],
  },
  {
    id: "your-rights",
    title: "9. Your Privacy Rights",
    body: [
      `Depending on the laws applicable in your location, you may have rights regarding your personal information. These may include the right to access the personal information we hold about you, request corrections to inaccurate information, request deletion of your information in certain circumstances, and ask questions about how your information is handled.`,
      `To exercise any rights you may have or to ask questions about your personal information, please contact us using the details provided in the Contact section below.`,
      `Please note that specific legal rights vary by jurisdiction. We will respond to reasonable requests in accordance with applicable law.`,
    ],
  },
  {
    id: "childrens-privacy",
    title: "10. Children's Privacy",
    body: [
      `BookStore is intended for use by individuals who are old enough to manage their own accounts in accordance with applicable laws in their location.`,
      `We do not knowingly collect personal information from children who are not of the appropriate age to use the platform. If you believe we have inadvertently collected information from a child, please contact us so we can take appropriate steps.`,
    ],
  },
  {
    id: "changes",
    title: "11. Changes to This Privacy Policy",
    body: [
      `BookStore may update this Privacy Policy from time to time as the platform develops or as our practices change. When we make significant changes, we will make reasonable efforts to notify users, such as by updating the "Last updated" date on this page or by communicating through the platform.`,
      `We encourage you to review this Privacy Policy periodically to stay informed about how we handle your information. Continued use of BookStore after changes are posted means you accept the updated policy.`,
    ],
  },
  {
    id: "contact",
    title: "12. Contact Us",
    body: [
      `If you have any questions, concerns, or requests regarding this Privacy Policy or the way BookStore handles your personal information, please contact us.`,
    ],
    contact: true,
  },
];

/* ─────────────────────────────────────────
   Table of Contents — sidebar / jump links
───────────────────────────────────────── */
function TableOfContents() {
  return (
    <motion.nav
      {...inFadeUp(0)}
      aria-label="Privacy Policy sections"
      className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6"
    >
      <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        Contents
      </p>
      <ol className="flex flex-col gap-2" role="list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block text-[13.5px] leading-relaxed text-neutral-500 transition-colors duration-150 hover:text-neutral-950 focus:outline-none focus-visible:text-neutral-950"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────
   Single policy section
───────────────────────────────────────── */
function PolicySection({ section, index }) {
  return (
    <motion.section
      id={section.id}
      {...inFadeUp(index * 0.04)}
      className="scroll-mt-24"
      aria-labelledby={`${section.id}-heading`}
    >
      <h2
        id={`${section.id}-heading`}
        className="mb-4 text-[1.1rem] font-bold tracking-tight text-neutral-950"
      >
        {section.title}
      </h2>

      <div className="flex flex-col gap-3">
        {section.body.map((para, i) => (
          <p
            key={i}
            className="text-[15px] leading-[1.85] text-neutral-600"
          >
            {para}
          </p>
        ))}

        {/* Contact section special treatment */}
        {section.contact && (
          <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-5">
            <p className="mb-1 text-[13.5px] font-semibold text-neutral-800">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[14px] text-neutral-600 underline underline-offset-4 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:text-neutral-950"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-500">
              You can also visit our{" "}
              <Link
                to="/contact"
                className="font-medium text-neutral-700 underline underline-offset-4 transition-colors hover:text-neutral-950"
              >
                Contact page
              </Link>{" "}
              to send us a message directly.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────
   Privacy page root
───────────────────────────────────────── */
function Privacy() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <div className="h-20" aria-hidden="true" />

      {/* ── Hero / intro ── */}
      <section
        className="relative overflow-hidden border-b border-neutral-100 bg-white py-16 lg:py-20"
        aria-labelledby="privacy-heading"
      >
        {/* Dot-grid */}
        <svg aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="priv-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#priv-grid)" />
        </svg>

        <Container>
          {/* Back navigation */}
          <motion.div {...fadeUp(0)} className="mb-10 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
              Home
            </Link>
            <Link
              to="/help"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <HelpCircle size={14} aria-hidden="true" />
              Help Center
            </Link>
          </motion.div>

          {/* Header */}
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0.06)}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1">
              <Shield size={12} strokeWidth={2} className="text-neutral-500" aria-hidden="true" />
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Privacy Policy
              </span>
            </motion.div>

            <motion.h1
              id="privacy-heading"
              {...fadeUp(0.12)}
              className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Privacy Policy
            </motion.h1>

            <motion.p {...fadeUp(0.18)}
              className="mb-5 max-w-xl text-[1.0625rem] leading-[1.78] text-neutral-500">
              This Privacy Policy describes how BookStore collects, uses, stores, and
              protects information when you use the BookStore platform.
            </motion.p>

            <motion.p {...fadeUp(0.22)}
              className="text-[13px] text-neutral-400">
              Last updated:{" "}
              <time dateTime={LAST_UPDATED} className="font-medium text-neutral-600">
                {LAST_UPDATED}
              </time>
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ── Body: ToC + sections ── */}
      <section className="py-16 lg:py-20" aria-label="Privacy Policy content">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr] lg:gap-16 xl:gap-24">

            {/* Sidebar ToC — sticky on desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents />
              </div>
            </aside>

            {/* Mobile ToC (collapsible feel — just rendered flat, clean) */}
            <div className="block lg:hidden">
              <TableOfContents />
            </div>

            {/* Policy sections */}
            <div className="flex flex-col gap-12">
              {sections.map((section, i) => (
                <PolicySection key={section.id} section={section} index={i} />
              ))}

              {/* Divider before footer note */}
              <div className="border-t border-neutral-100 pt-8">
                <p className="text-[13px] leading-relaxed text-neutral-400">
                  This document was last updated on{" "}
                  <time dateTime={LAST_UPDATED} className="font-medium text-neutral-600">
                    {LAST_UPDATED}
                  </time>
                  . For questions, email{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium text-neutral-700 underline underline-offset-4 transition-colors hover:text-neutral-950"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default Privacy;
