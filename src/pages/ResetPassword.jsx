import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { IconEye, IconEyeOff } from '../components/Icons';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage  from '../assets/library.svg';
import { resetPassword } from '../services/api';

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

const TERMINAL = {
  missingToken: {
    Icon: AlertCircle, colour: 'text-neutral-500',
    heading: 'Reset link is missing',
    body:    'This page requires the password reset link sent to your email. Please click the link in that email or request a new one.',
    cta:     { label: 'Request new reset link', to: '/forgot-password' },
  },
  invalid: {
    Icon: XCircle, colour: 'text-neutral-500',
    heading: 'Reset link is invalid',
    body:    'This password reset link is invalid or has already been used. Please request a new one.',
    cta:     { label: 'Request new reset link', to: '/forgot-password' },
  },
  expired: {
    Icon: Clock, colour: 'text-neutral-500',
    heading: 'Reset link expired',
    body:    'This password reset link has expired — it is only valid for 1 hour. Please request a fresh one.',
    cta:     { label: 'Request new reset link', to: '/forgot-password' },
  },
  success: {
    Icon: CheckCircle2, colour: 'text-neutral-950',
    heading: 'Password reset',
    body:    'Your password has been updated. You can now sign in with your new password.',
    cta:     { label: 'Continue to Login', to: '/login' },
  },
};

function TerminalState({ type }) {
  const cfg      = TERMINAL[type];
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease }}
      className="flex flex-col items-center gap-5 py-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <cfg.Icon size={28} strokeWidth={1.75} className={cfg.colour} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">{cfg.heading}</h2>
        <p className="text-[14px] leading-[1.75] text-neutral-500">{cfg.body}</p>
      </div>
      <button
        onClick={() => navigate(cfg.cta.to)}
        className="mt-2 inline-flex h-12 items-center rounded-full bg-neutral-950 px-8 text-[14.5px] font-semibold text-white transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {cfg.cta.label}
      </button>
    </motion.div>
  );
}

function ResetPassword() {
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get('token');

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [terminalState,   setTerminalState]   = useState(token ? null : 'missingToken');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6)          { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword)  { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setTerminalState('success');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('INVALID_RESET_TOKEN') || msg.toLowerCase().includes('invalid'))
        setTerminalState('invalid');
      else if (msg.includes('RESET_TOKEN_EXPIRED') || msg.toLowerCase().includes('expired'))
        setTerminalState('expired');
      else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch'))
        setError('Network connection problem. Please check your internet and try again.');
      else
        setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (terminalState) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-12" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="w-full max-w-105">
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            <img src={bookstoreLogo} alt="" className="h-7 w-7" aria-hidden="true" />
            <span className="text-[17px] font-bold tracking-tight text-neutral-950">BookStore</span>
          </Link>
          <TerminalState type={terminalState} />
        </div>
      </div>
    );
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
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2" aria-label="BookStore — go to homepage">
            <img src={bookstoreLogo} alt="" className="h-7 w-7" aria-hidden="true" />
            <span className="text-[17px] font-bold tracking-tight text-neutral-950">BookStore</span>
          </Link>

          <div className="mb-8">
            <h1 className="mb-1.5 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
              Choose a new password
            </h1>
            <p className="text-[15px] text-neutral-500">Make it something strong — at least 6 characters.</p>
          </div>

          <div className="mb-5">
            <ErrorBanner message={error} />
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-password" className="text-[13px] font-semibold text-neutral-700">New password</label>
              <div className="relative">
                <input
                  id="rp-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                  required
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 pr-12 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 transition hover:text-neutral-700 focus:outline-none">
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rp-confirm" className="text-[13px] font-semibold text-neutral-700">Confirm new password</label>
              <div className="relative">
                <input
                  id="rp-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 pr-12 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 transition hover:text-neutral-700 focus:outline-none">
                  {showConfirm ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-12 w-full rounded-xl bg-neutral-950 text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" aria-hidden="true" />Resetting…</span>
                : 'Reset password'
              }
            </button>
          </form>

          <p className="mt-7 text-center text-[14px] text-neutral-500">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden overflow-hidden bg-neutral-50 lg:flex lg:w-1/2 lg:items-center lg:justify-center" aria-hidden="true">
        <img src={libraryImage} alt="" className="max-h-[72vh] w-full max-w-120 object-contain" />
      </div>
    </div>
  );
}

export default ResetPassword;
