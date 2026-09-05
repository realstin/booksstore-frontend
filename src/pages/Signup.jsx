import { Link, useNavigate } from 'react-router-dom';
import { registerUser, googleLogin } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import { AUTH_MESSAGES } from '../constants/messages';
import { validateSignupForm } from '../utils/validation';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage from '../assets/library.svg';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

/* ─────────────────────────────────────────
   Human-readable error messages
───────────────────────────────────────── */
function friendlyAuthError(raw) {
  if (!raw) return 'Something went wrong. Please try again.';
  const msg = raw.toLowerCase();
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch'))
    return 'Network connection problem. Please check your internet connection and try again.';
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email already'))
    return 'This email is already registered. Please sign in with your email and password instead.';
  if (msg.includes('invalid credential') || msg.includes('invalid token') || msg.includes('could not verify'))
    return 'This Google account could not be verified. Please try again.';
  if (raw.length < 120 && !raw.includes('Error:') && !raw.includes('JWT') && !raw.includes('mongoose'))
    return raw;
  return "We couldn't sign you up with Google. Please try again.";
}

/* ─────────────────────────────────────────
   Inline error banner
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   OR divider
───────────────────────────────────────── */
function OrDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-neutral-200" />
      <span className="text-[12px] font-semibold uppercase tracking-widest text-neutral-400">or</span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Email-sent success state
───────────────────────────────────────── */
function EmailSentState({ email }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
          We sent a verification link to{' '}
          {email && <strong className="font-semibold text-neutral-800">{email}</strong>}.
          Click the link to activate your account.
        </p>
        <p className="text-[13px] text-neutral-400">
          Can&apos;t find it? Check your spam or junk folder.
        </p>
      </div>
      <Link
        to="/login"
        className="mt-2 inline-flex h-11 items-center rounded-full border border-neutral-200 px-7 text-[14px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        Go to Login
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Signup page
───────────────────────────────────────── */
function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed,       setAgreed]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState('');
  /* Track the email that was registered so we can show it in the success state */
  const [verificationEmail, setVerificationEmail] = useState('');

  const { form, error, loading, handleChange, handleSubmit, setError } = useForm(
    { name: '', email: '', password: '' },
    async (formData) => {
      if (!agreed) { setError(AUTH_MESSAGES.SIGNUP_AGREE_ERROR); return; }
      const validation = validateSignupForm(formData.name, formData.email, formData.password);
      if (!validation.valid) { setError(validation.error); return; }

      const data = await registerUser(formData);

      /*
        Three possible backend responses:
        1. Email verification required → data.code === 'EMAIL_VERIFICATION_REQUIRED'
           Show the "check your email" screen.
        2. Auto-login (no email verification) → data.user exists
           Log the user in and go to dashboard.
        3. Any other shape → treat as success and go to login.
      */
      if (data?.code === 'EMAIL_VERIFICATION_REQUIRED') {
        setVerificationEmail(formData.email);
        return; // show EmailSentState — useForm will not throw
      }

      if (data?.user) {
        login(data);
        navigate('/home');
        return;
      }

      /* Fallback — backend registered successfully but no session */
      navigate('/login');
    }
  );

  async function handleGoogleSuccess(credential) {
    if (googleLoading) return;
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const data = await googleLogin(credential);
      login(data);
      navigate('/home');
    } catch (err) {
      setGoogleError(friendlyAuthError(err.message));
    } finally {
      setGoogleLoading(false);
    }
  }

  const isBusy = loading || googleLoading;

  /* ── Email verification sent → show success screen ── */
  if (verificationEmail) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-12"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="w-full max-w-105">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <img src={bookstoreLogo} alt="" className="h-7 w-7" aria-hidden="true" />
            <span className="text-[17px] font-bold tracking-tight text-neutral-950">BookStore</span>
          </Link>
          <EmailSentState email={verificationEmail} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen w-full bg-white"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* ── LEFT — form panel ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-110"
        >
          {/* Logo */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="BookStore — go to homepage"
          >
            <img src={bookstoreLogo} alt="" className="h-7 w-7" aria-hidden="true" />
            <span className="text-[17px] font-bold tracking-tight text-neutral-950">BookStore</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-1.5 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
              {AUTH_MESSAGES.SIGNUP_TITLE}
            </h1>
            <p className="text-[15px] text-neutral-500">{AUTH_MESSAGES.SIGNUP_SUBTITLE}</p>
          </div>

          {/* Form error */}
          <div className="mb-5">
            <ErrorBanner message={error} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-[13px] font-semibold text-neutral-700">
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder={AUTH_MESSAGES.SIGNUP_NAME_PLACEHOLDER}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-[13px] font-semibold text-neutral-700">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder={AUTH_MESSAGES.SIGNUP_EMAIL_PLACEHOLDER}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-[13px] font-semibold text-neutral-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={AUTH_MESSAGES.SIGNUP_PASSWORD_PLACEHOLDER}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 pr-12 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 transition hover:text-neutral-700 focus:outline-none"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-neutral-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-neutral-950"
              />
              <span>
                {AUTH_MESSAGES.SIGNUP_TERMS}{' '}
                <Link to="/terms" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
                  {AUTH_MESSAGES.SIGNUP_TERMS_SERVICE}
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
                  {AUTH_MESSAGES.SIGNUP_PRIVACY}
                </Link>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy}
              className="mt-1 h-12 w-full rounded-xl bg-neutral-950 text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {loading ? AUTH_MESSAGES.SIGNUP_CREATING : AUTH_MESSAGES.SIGNUP_BUTTON}
            </button>
          </form>

          {/* OR */}
          <div className="my-5">
            <OrDivider />
          </div>

          {/* Google error */}
          {googleError && (
            <div className="mb-3">
              <ErrorBanner message={googleError} />
            </div>
          )}

          {/* Google button */}
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setGoogleError(msg || 'Google sign-in was cancelled.')}
            disabled={isBusy}
          />

          {/* Switch link */}
          <p className="mt-7 text-center text-[14px] text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
              Sign in
            </Link>
          </p>

          {/* Motto */}
          <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
            {AUTH_MESSAGES.MOTTO}
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT — illustration (desktop only) ── */}
      <div
        className="hidden overflow-hidden bg-neutral-50 lg:flex lg:w-1/2 lg:items-center lg:justify-center"
        aria-hidden="true"
      >
        <img
          src={libraryImage}
          alt=""
          className="max-h-[72vh] w-full max-w-120 object-contain"
        />
      </div>
    </div>
  );
}

export default Signup;
