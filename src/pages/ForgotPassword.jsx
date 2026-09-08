import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage  from '../assets/library.svg';
import { forgotPassword } from '../services/api';

const ease = [0.22, 1, 0.36, 1];

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13.5px] text-red-700"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
        <line x1="7" y1="4.5" x2="7" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </motion.div>
  );
}

function EmailSentState({ email }) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease }}
      className="flex flex-col items-center gap-5 py-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <Mail size={26} strokeWidth={1.5} className="text-neutral-700" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">
          Check your email
        </h2>
        <p className="text-[14px] leading-[1.75] text-neutral-500">
          If an account exists for{' '}
          <strong className="font-semibold text-neutral-800">{email}</strong>,
          we&apos;ve sent a password reset link. Click it to choose a new password.
        </p>
        <p className="text-[13px] text-neutral-400">
          The link expires in 1 hour. Can&apos;t find it? Check your spam folder.
        </p>
      </div>
      <Link
        to="/login"
        className="mt-2 inline-flex h-11 items-center rounded-full border border-neutral-200 px-7 text-[14px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        Back to Login
      </Link>
    </motion.div>
  );
}

function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [sentTo,  setSentTo]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      await forgotPassword(trimmed);
      setSentTo(trimmed);
      setSent(true);
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network connection problem. Please check your internet and try again.');
      } else {
        // Never reveal whether account exists — show success regardless
        setSentTo(trimmed);
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="w-full max-w-110"
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="BookStore — go to homepage"
          >
            <img src={bookstoreLogo} alt="" className="h-7 w-7" aria-hidden="true" />
            <span className="text-[17px] font-bold tracking-tight text-neutral-950">BookStore</span>
          </Link>

          <AnimatePresence mode="wait">
            {sent ? (
              <EmailSentState key="sent" email={sentTo} />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/login"
                  className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 transition hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
                  Back to Login
                </Link>

                <div className="mb-8">
                  <h1 className="mb-1.5 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
                    Forgot password?
                  </h1>
                  <p className="text-[15px] text-neutral-500">
                    No problem. Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <div className="mb-5">
                  <ErrorBanner message={error} />
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fp-email" className="text-[13px] font-semibold text-neutral-700">
                      Email address
                    </label>
                    <input
                      id="fp-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      required
                      className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 h-12 w-full rounded-xl bg-neutral-950 text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                </form>

                <p className="mt-7 text-center text-[14px] text-neutral-500">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="hidden overflow-hidden bg-neutral-50 lg:flex lg:w-1/2 lg:items-center lg:justify-center" aria-hidden="true">
        <img src={libraryImage} alt="" className="max-h-[72vh] w-full max-w-120 object-contain" />
      </div>
    </div>
  );
}

export default ForgotPassword;
