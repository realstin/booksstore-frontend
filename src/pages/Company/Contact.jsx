import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser";

/* ─────────────────────────────────────────
   EmailJS credentials
   Replace these three values with your own
   from https://www.emailjs.com/
───────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ─────────────────────────────────────────
   Inline social icons (not in this lucide version)
───────────────────────────────────────── */
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.6 1h2.4L9.6 7l6 8H10L6.4 9.8 2.2 15H0l5.8-6.5L.2 1H5l3.2 4.7L12.6 1zm-.9 12.6h1.3L4.4 2.3H3L11.7 13.6z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Shared easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

/* ─────────────────────────────────────────
   Contact info items
───────────────────────────────────────── */
const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@bookstore.app",
    href: "mailto:justiniratuzimbonyinshuti@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kigali, Rwanda",
    href: null,
  },
  {
    icon: XIcon,
    label: "X (Twitter)",
    value: "@irmjustin",
    href: "https://x.com/irmjustin",
  },
  {
    icon: GitHubIcon,
    label: "GitHub",
    value: "github.com/realstin",
    href: "https://github.com/realstin",
  },
];

/* ─────────────────────────────────────────
   Contact form — wired to EmailJS
───────────────────────────────────────── */
function ContactForm() {
  const formRef = useRef(null);
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus]   = useState("idle"); // "idle" | "sending" | "sent" | "error"
  const [error, setError]     = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setError("Something went wrong. Please try again or email us directly.");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col items-center gap-5 py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M6 14l6 6L22 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-[1.2rem] font-bold text-neutral-950">Message sent!</h3>
        <p className="max-w-sm text-[14.5px] leading-relaxed text-neutral-500">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-[13.5px] font-medium text-neutral-500 underline underline-offset-4 transition hover:text-neutral-950"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13.5px] font-medium text-red-600"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[13px] font-semibold text-neutral-700">
            Full Name <span className="text-neutral-400" aria-hidden="true">*</span>
          </label>
          <input
            id="name" name="name" type="text"
            value={form.name} onChange={handleChange}
            placeholder="Your name" required
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] font-semibold text-neutral-700">
            Email Address <span className="text-neutral-400" aria-hidden="true">*</span>
          </label>
          <input
            id="email" name="email" type="email"
            value={form.email} onChange={handleChange}
            placeholder="your@email.com" required
            className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-[13px] font-semibold text-neutral-700">
          Subject
        </label>
        <input
          id="subject" name="subject" type="text"
          value={form.subject} onChange={handleChange}
          placeholder="What's this about?"
          className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[13px] font-semibold text-neutral-700">
          Message <span className="text-neutral-400" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message" name="message"
          value={form.message} onChange={handleChange}
          placeholder="Write your message here…" required rows={6}
          className="resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] leading-relaxed text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200 focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        />
        <p className="self-end text-[11.5px] text-neutral-400">{form.message.length} characters</p>
      </div>

      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18 }}
        className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-[15px] font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2L9.5 13.5 7.5 8.5 2 6.5 14 2z" />
              <path d="M14 2L7.5 8.5" />
            </svg>
          </>
        )}
      </motion.button>

      <p className="text-center text-[12px] text-neutral-400">
        We typically respond within 24 hours.
      </p>
    </form>
  );
}

/* ─────────────────────────────────────────
   Contact Page
───────────────────────────────────────── */
function Contact() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Dot-grid background */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="contact-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contact-dot-grid)" />
      </svg>

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-16">

        {/* ── Back to home ── */}
        <motion.div {...fadeUp(0)} className="mb-16">
          <Link
            to="/homepage"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Home
          </Link>
        </motion.div>

        {/* ── Page header ── */}
        <div className="mb-16 text-center">
          <motion.p
            {...fadeUp(0.05)}
            className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          >
            Contact Us
          </motion.p>
          <motion.h1
            {...fadeUp(0.12)}
            className="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-neutral-950"
          >
            We&apos;d love to hear
            <br className="hidden sm:block" /> from you.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mx-auto max-w-md text-[1.0625rem] leading-[1.78] text-neutral-500"
          >
            Have a question, suggestion or just want to say hello?
            Send us a message and we&apos;ll get back to you.
          </motion.p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr]">

          {/* Left — contact info */}
          <motion.div {...fadeUp(0.28)} className="flex flex-col gap-6">

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <h2 className="mb-6 text-[15px] font-bold tracking-tight text-neutral-950">
                Contact Information
              </h2>

              <ul className="flex flex-col gap-5" role="list">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-600">
                      <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-neutral-400">
                        {label}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-[14px] font-medium text-neutral-700 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:text-neutral-950"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-[14px] font-medium text-neutral-700">{value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Response time note */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 px-6 py-5">
              <p className="text-[13.5px] leading-relaxed text-neutral-500">
                <span className="font-semibold text-neutral-800">Quick response.</span>{" "}
                We usually reply within 24 hours on weekdays.
              </p>
            </div>

          </motion.div>

          {/* Right — form */}
          <motion.div
            {...fadeUp(0.35)}
            className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-10"
          >
            <h2 className="mb-8 text-[15px] font-bold tracking-tight text-neutral-950">
              Send a Message
            </h2>
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
