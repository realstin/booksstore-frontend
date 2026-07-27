import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, HelpCircle } from "lucide-react";
import Container from "../../components/Container";
import Navbar from "../../components/Homepage/Navbar";
import Footer from "../../components/Homepage/Footer";

/* ─────────────────────────────────────────
   Config — update these when terms change
───────────────────────────────────────── */
const LAST_UPDATED   = "July 27, 2026";
const CONTACT_EMAIL  = "justiniratuzimbonyinshuti@gmail.com";
// Placeholder — replace with actual jurisdiction once decided
const GOVERNING_LAW  = "[Jurisdiction to be confirmed]";

/* ─────────────────────────────────────────
   Shared easing (matches rest of app)
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
   Terms sections data
───────────────────────────────────────── */
const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using the BookStore platform, you agree to be bound by these Terms of Service. Please read them carefully before using the service.",
      "If you do not agree with any part of these Terms, you should not use BookStore. Continued use of the platform following any updates to these Terms will be considered acceptance of those changes.",
    ],
  },
  {
    id: "about",
    title: "2. About BookStore",
    body: [
      "BookStore is a platform designed to help people discover trusted, up-to-date, and useful books in an organised learning environment.",
      "Features currently available or in development include: discovering and searching for books across organised categories, reading available books online through a focused reading experience, downloading books for offline use where that option is available, saving books to a personal library, and marking books as favourites.",
      "The features and services available on BookStore may change over time as the platform continues to develop.",
    ],
  },
  {
    id: "user-accounts",
    title: "3. User Accounts",
    body: [
      "Some features of BookStore may require you to create an account. When creating an account, you agree to provide accurate and complete information.",
      "You are responsible for keeping your login credentials secure and for all activity that occurs under your account. You must not share your account credentials with others in ways that could compromise the security of your account or the platform.",
      "If you believe your account has been accessed without your authorisation, you should contact BookStore as soon as possible so that appropriate steps can be taken.",
    ],
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    body: [
      "You agree to use BookStore responsibly and in accordance with these Terms and any applicable laws.",
      "You must not use the platform for any unlawful purpose, attempt to gain unauthorised access to the platform or to any other user's account, interfere with or disrupt the operation or security of the service, attempt to scrape or systematically extract data from the platform in ways that damage or misuse the service, or engage in any activity that violates the rights of others.",
      "BookStore reserves the right to take action, including suspending or terminating access, if a user's behaviour is found to violate these Terms or to harm the service or other users.",
    ],
  },
  {
    id: "intellectual-property",
    title: "5. Book Content and Intellectual Property",
    body: [
      "Books, cover images, text, logos, and other content available on or through BookStore may be protected by copyright, intellectual property laws, or other rights belonging to the original authors, publishers, or other rights holders.",
      "By using BookStore, you agree to respect the rights of copyright holders and content owners. You must not reproduce, distribute, modify, or use content in ways that infringe upon those rights without appropriate authorisation.",
      "Where books or resources are provided through or in connection with external sources or third-party services, those materials may be subject to their own terms, licences, and rights. BookStore does not claim ownership of third-party books or content unless BookStore has obtained the appropriate rights for those specific materials.",
      "The BookStore name, logo, and original platform design are the intellectual property of BookStore.",
    ],
  },
  {
    id: "user-library",
    title: "6. User Library and Saved Content",
    body: [
      "BookStore allows users to save books to a personal library and mark books as favourites where those features are available. These features are designed to help you organise your personal learning experience.",
      "The availability of individual books may change over time due to circumstances such as changes in third-party rights or content availability. BookStore cannot guarantee that every saved book will remain available indefinitely.",
    ],
  },
  {
    id: "book-availability",
    title: "7. Book Availability and Accuracy",
    body: [
      "BookStore aims to provide useful and reliable book information. However, we cannot guarantee that all information on the platform will always be completely accurate, current, or free from errors.",
      "Book availability, metadata, descriptions, links, and external resources may change. We encourage users to verify important information through additional sources where appropriate.",
    ],
  },
  {
    id: "third-party",
    title: "8. Third-Party Services and Links",
    body: [
      "BookStore may link to or rely on third-party services, platforms, or resources in connection with providing certain features.",
      "Third-party websites and services are governed by their own terms of service and privacy policies. BookStore is not responsible for the policies, practices, or content of external services that it does not control.",
      "Your use of third-party services is at your own discretion and subject to the terms of those services.",
    ],
  },
  {
    id: "availability",
    title: "9. Availability of the Service",
    body: [
      "BookStore aims to keep the platform available and reliable. However, we cannot guarantee uninterrupted or error-free access at all times.",
      "The service may occasionally be unavailable due to scheduled maintenance, updates, technical issues, security measures, or circumstances outside of BookStore's reasonable control.",
      "We will make reasonable efforts to minimise disruptions and to communicate planned downtime where possible.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Disclaimer",
    body: [
      "BookStore provides the platform and its services on an \"as available\" basis. To the extent permitted by applicable law, BookStore makes no warranties, express or implied, regarding the platform, its content, or the results you may obtain from using it.",
      "This disclaimer does not affect any rights that cannot be excluded under applicable consumer protection or other laws.",
    ],
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    body: [
      "To the extent permitted by applicable law, BookStore will not be liable for any indirect, incidental, special, or consequential losses arising out of or in connection with your use of the platform, including but not limited to loss of data, loss of access to saved content, or interruption of service.",
      "Nothing in these Terms is intended to limit any liability that cannot lawfully be excluded or restricted, including liability for fraud or for death or personal injury caused by negligence.",
      "This section is a general limitation and is intended for review by a qualified legal professional before the platform launches publicly.",
    ],
  },
  {
    id: "termination",
    title: "12. Termination or Suspension",
    body: [
      "BookStore may suspend or terminate a user's access to the platform where reasonably necessary, including in cases involving serious violations of these Terms, unlawful activity, abuse of the platform, or security threats.",
      "You may stop using BookStore at any time. If you wish to close your account, please contact us using the details in the Contact section below.",
      "Where feasible, BookStore will notify users before taking action, unless immediate action is required to protect the service or other users.",
    ],
  },
  {
    id: "changes",
    title: "13. Changes to These Terms",
    body: [
      "BookStore may update these Terms of Service from time to time as the platform develops or as legal or operational requirements change.",
      "When significant changes are made, we will make reasonable efforts to notify users, such as by updating the \"Last updated\" date on this page or by communicating through the platform.",
      "We encourage you to review these Terms periodically. Continued use of BookStore after updated Terms are published will be considered acceptance of those changes.",
    ],
  },
  {
    id: "governing-law",
    title: "14. Governing Law",
    body: [
      `These Terms of Service and any disputes arising from them will be governed by the laws of ${GOVERNING_LAW}. This section will be updated once BookStore's legal jurisdiction has been formally confirmed.`,
      "If you have questions about the governing law that applies to these Terms, please contact us using the details below.",
    ],
    note: "⚠ Governing law will replace with actual jurisdiction before public launch.",
  },
  {
    id: "contact",
    title: "15. Contact Us",
    body: [
      "If you have any questions, concerns, or requests relating to these Terms of Service, please contact us.",
    ],
    contact: true,
  },
];

/* ─────────────────────────────────────────
   Table of Contents
───────────────────────────────────────── */
function TableOfContents() {
  return (
    <motion.nav
      {...inFadeUp(0)}
      aria-label="Terms of Service sections"
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
   Single terms section
───────────────────────────────────────── */
function TermsSection({ section, index }) {
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
          <p key={i} className="text-[15px] leading-[1.85] text-neutral-600">
            {para}
          </p>
        ))}

        {/* Placeholder notice for governing law */}
        {section.note && (
          <div className="mt-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-[13px] text-neutral-500">{section.note}</p>
          </div>
        )}

        {/* Contact section */}
        {section.contact && (
          <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-5">
            <p className="mb-1 text-[13.5px] font-semibold text-neutral-800">Email</p>
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
   Terms page root
───────────────────────────────────────── */
function Terms() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <div className="h-20" aria-hidden="true" />

      {/* ── Hero / intro ── */}
      <section
        className="relative overflow-hidden border-b border-neutral-100 bg-white py-16 lg:py-20"
        aria-labelledby="terms-heading"
      >
        {/* Dot-grid */}
        <svg aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terms-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terms-grid)" />
        </svg>

        <Container>
          {/* Back navigation */}
          <motion.div {...fadeUp(0)} className="mb-10 flex flex-wrap items-center gap-3">
            <Link
              to="/homepage"
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
              <FileText size={12} strokeWidth={2} className="text-neutral-500" aria-hidden="true" />
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Terms of Service
              </span>
            </motion.div>

            <motion.h1
              id="terms-heading"
              {...fadeUp(0.12)}
              className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-neutral-950"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Terms of Service
            </motion.h1>

            <motion.p {...fadeUp(0.18)}
              className="mb-5 max-w-xl text-[1.0625rem] leading-[1.78] text-neutral-500">
              These Terms of Service describe the rules and conditions that apply
              when you access and use the BookStore platform. Please read them
              carefully before using the service.
            </motion.p>

            <motion.p {...fadeUp(0.22)} className="text-[13px] text-neutral-400">
              Last updated:{" "}
              <time dateTime={LAST_UPDATED} className="font-medium text-neutral-600">
                {LAST_UPDATED}
              </time>
            </motion.p>
          </div>
        </Container>
      </section>

      {/* ── Body: ToC + sections ── */}
      <section className="py-16 lg:py-20" aria-label="Terms of Service content">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr] lg:gap-16 xl:gap-24">

            {/* Sticky sidebar ToC — desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents />
              </div>
            </aside>

            {/* Inline ToC — mobile */}
            <div className="block lg:hidden">
              <TableOfContents />
            </div>

            {/* Terms sections */}
            <div className="flex flex-col gap-12">
              {sections.map((section, i) => (
                <TermsSection key={section.id} section={section} index={i} />
              ))}

              {/* Footer note */}
              <div className="border-t border-neutral-100 pt-8">
                <p className="text-[13px] leading-relaxed text-neutral-400">
                  These Terms were last updated on{" "}
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

export default Terms;
