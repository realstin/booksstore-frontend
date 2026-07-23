import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "../Container";
import bookstoreLogo from '../../assets/bookstorelogo.svg';

/* ─────────────────────────────────────────
   Footer link data
───────────────────────────────────────── */
const columns = [
  {
    heading: "Product",
    links: [
      { label: "Books",          href: "#" },
      { label: "Reader",         href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",    href: "/about",   internal: true },
      { label: "Team",     href: "/team",    internal: true },
      { label: "Careers",  href: "#" },
      { label: "Contact",  href: "/contact", internal: true },
      { label: "News",     href: "/news",    internal: true },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center",      href: "#" },
      { label: "Privacy Policy",   href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "FAQ",              href: "#" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub",      href: "https://github.com/realstin" },
      { label: "Discord",     href: "https://discord.com/users/1528631236824928326" },
      { label: "LinkedIn",    href: "https://www.linkedin.com/in/iratuzi-justin-400a55405/" },
      { label: "X (Twitter)", href: "https://x.com/irmjustin" },
    ],
  },
];

/* ─────────────────────────────────────────
   Animated footer link
   — uses <Link> for internal routes,
     <a> for external/anchor hrefs
───────────────────────────────────────── */
function FooterLink({ label, href, internal }) {
  const baseClass =
    "block text-[14px] leading-relaxed text-neutral-500 transition-colors duration-200 hover:text-neutral-950 focus:outline-none focus-visible:text-neutral-950";

  if (internal) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
        <Link to={href} className={baseClass}>
          {label}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={baseClass}
    >
      {label}
    </motion.a>
  );
}

/* ─────────────────────────────────────────
   Newsletter form
───────────────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex w-full max-w-70 flex-col gap-2.5"
      aria-label="Newsletter subscription"
    >
      {sent ? (
        <p className="text-[13.5px] font-medium text-neutral-600">
          ✓ You&apos;re subscribed.
        </p>
      ) : (
        <>
          <label htmlFor="footer-email" className="sr-only">
            Your email address
          </label>
          <input
            id="footer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[13.5px] text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Subscribe
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </motion.button>
        </>
      )}
    </form>
  );
}

/* ─────────────────────────────────────────
   Footer
───────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-100 bg-white" role="contentinfo">
      <Container>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-12 py-20 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:py-24">

          {/* ── Col 1 — brand + newsletter ── */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link
              to="/homepage"
              className="mb-4 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              aria-label="BookStore — go to homepage"
            >
              <img
                src={bookstoreLogo}
                alt=""
                className="h-6 w-6"
                aria-hidden="true"
              />
              <span className="text-[18px] font-semibold tracking-tight text-neutral-950">
                BookStore
              </span>
            </Link>

            {/* Description */}
            <p className="max-w-60 text-[13.5px] leading-[1.75] text-neutral-500">
              Building the future of trusted learning through carefully selected books.
            </p>

            {/* Newsletter */}
            <NewsletterForm />
          </div>

          {/* ── Cols 2–5 — link columns ── */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                {col.heading}
              </p>
              <nav aria-label={`${col.heading} links`}>
                <ul className="flex flex-col gap-3" role="list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink label={link.label} href={link.href} internal={link.internal} />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 py-7 text-[13px] text-neutral-400 sm:flex-row">
          <p>
            &copy; {year} BookStore. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Building the Future of Trusted Learning.
          </p>
        </div>

      </Container>
    </footer>
  );
}

export default Footer;
