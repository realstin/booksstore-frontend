import { useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import { verifyEmail, resendVerification } from '../services/api';

const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   VerifyEmail page
   Reads ?email= from the URL (set by Signup.jsx).
   User types their 6-digit code and submits.
───────────────────────────────────────── */
function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  // Pre-fill email from URL param set by Signup; user can also type it manually
  const urlEmail = searchParams.get('email') || '';

  const [email,        setEmail]        = useState(urlEmail);
  const [digits,       setDigits]       = useState(['', '', '', '', '', '']);
  const [status,       setStatus]       = useState('idle'); // idle | loading | success | error
  const [errorMsg,     setErrorMsg]     = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // idle | loading | sent

  const inputRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  /* ── Digit input handling ── */
  function handleDigitChange(index, value) {
    const v = value.replace(/\D/g, '').slice(-1); // only last digit, only numbers
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setErrorMsg('');

    // Auto-advance to next box
    if (v && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  }

  function handleDigitKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handleDigitPaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs[5].current?.focus();
    }
    e.preventDefault();
  }

  const code = digits.join('');

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await verifyEmail(email.trim(), code);

      if (result.code === 'EMAIL_VERIFIED') {
        setStatus('success');
        return;
      }
      if (result.code === 'EMAIL_ALREADY_VERIFIED') {
        setStatus('success');
        return;
      }
      if (result.code === 'CODE_EXPIRED') {
        setStatus('idle');
        setErrorMsg('This code has expired. Request a new one below.');
        return;
      }

      // INVALID_CODE or anything else
      setStatus('idle');
      setErrorMsg(result.message || 'Incorrect code. Please try again.');
    } catch {
      setStatus('idle');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  /* ── Resend ── */
  async function handleResend() {
    if (resendStatus === 'loading' || !email.trim()) return;
    setResendStatus('loading');
    setErrorMsg('');
    try {
      await resendVerification(email.trim());
      setResendStatus('sent');
      // Reset the digit inputs
      setDigits(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } catch {
      setResendStatus('idle');
    }
  }

  /* ── Success screen ── */
  if (status === 'success') {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-16"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
            <div className="flex items-center justify-center border-b border-neutral-100 px-8 py-6">
              <Link to="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="BookStore">
                <img src={bookstoreLogo} alt="BookStore" className="h-6 w-6" />
                <span className="text-[18px] font-semibold tracking-tight text-neutral-950">BookStore</span>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-6 px-8 py-10 text-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50"
              >
                <CheckCircle2 size={28} strokeWidth={1.75} className="text-neutral-950" aria-hidden="true" />
              </motion.div>
              <div className="flex flex-col gap-2">
                <h1 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">Email verified</h1>
                <p className="text-[14px] leading-[1.75] text-neutral-500">
                  Your BookStore account is ready. You can now log in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-8 text-[14.5px] font-semibold text-white transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Code entry form ── */
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-16"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Dot grid */}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ve-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ve-dot-grid)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">

          {/* Logo band */}
          <div className="flex items-center justify-center border-b border-neutral-100 px-8 py-6">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2" aria-label="BookStore">
              <img src={bookstoreLogo} alt="BookStore" className="h-6 w-6" />
              <span className="text-[18px] font-semibold tracking-tight text-neutral-950">BookStore</span>
            </Link>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <h1 className="mb-2 text-[1.15rem] font-bold tracking-tight text-neutral-950">
              Enter your verification code
            </h1>
            <p className="mb-8 text-[14px] leading-[1.75] text-neutral-500">
              We sent a 6-digit code to your email address.
              Enter it below to activate your account.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

              {/* Email field — shown only if not pre-filled from URL */}
              {!urlEmail && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ve-email" className="text-[13px] font-semibold text-neutral-700">
                    Email address
                  </label>
                  <input
                    id="ve-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[14px] text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  />
                </div>
              )}

              {/* 6-digit code boxes */}
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-semibold text-neutral-700">Verification code</p>
                <div
                  className="flex items-center justify-between gap-2"
                  onPaste={handleDigitPaste}
                  role="group"
                  aria-label="6-digit verification code"
                >
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={inputRefs[i]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      disabled={status === 'loading'}
                      aria-label={`Digit ${i + 1}`}
                      className={[
                        'h-14 w-full rounded-xl border text-center text-[22px] font-bold text-neutral-950 outline-none transition-all duration-150',
                        'focus:border-neutral-950 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,20,25,0.08)] focus-visible:outline-none',
                        d ? 'border-neutral-950 bg-neutral-50' : 'border-neutral-200 bg-neutral-50',
                        status === 'loading' ? 'cursor-not-allowed opacity-60' : '',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[13px] text-red-500"
                  role="alert"
                >
                  {errorMsg}
                </motion.p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading' || code.length < 6}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-[14.5px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-busy={status === 'loading'}
              >
                {status === 'loading'
                  ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Verifying…</>
                  : 'Verify Email'
                }
              </button>

            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              {resendStatus === 'sent' ? (
                <p className="text-[13px] text-neutral-500">
                  ✓ A new code has been sent to your email.
                </p>
              ) : (
                <p className="text-[13px] text-neutral-500">
                  Didn&apos;t receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendStatus === 'loading' || !email.trim()}
                    className="font-semibold text-neutral-700 underline underline-offset-4 transition hover:text-neutral-950 focus:outline-none disabled:opacity-50"
                  >
                    {resendStatus === 'loading' ? 'Sending…' : 'Resend code'}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-neutral-400">
          Need help?{' '}
          <Link to="/contact" className="font-medium text-neutral-600 underline underline-offset-4 transition hover:text-neutral-950">
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
