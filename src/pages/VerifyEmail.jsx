import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, Clock, AlertCircle,
  Loader2, Mail,
} from 'lucide-react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import { verifyEmail } from '../services/api';

const ease = [0.22, 1, 0.36, 1];

const STATES = {
  loading:         'loading',
  verified:        'verified',
  alreadyVerified: 'alreadyVerified',
  invalidToken:    'invalidToken',
  expiredToken:    'expiredToken',
  missingToken:    'missingToken',
  unknownError:    'unknownError',
};

function codeToState(code, ok) {
  if (!code && ok) return STATES.verified;
  switch (code) {
    case 'EMAIL_VERIFIED':             return STATES.verified;
    case 'EMAIL_ALREADY_VERIFIED':     return STATES.alreadyVerified;
    case 'INVALID_VERIFICATION_TOKEN': return STATES.invalidToken;
    case 'VERIFICATION_TOKEN_EXPIRED': return STATES.expiredToken;
    default:                           return STATES.unknownError;
  }
}

const STATE_CONFIG = {
  [STATES.verified]:        { icon: CheckCircle2, colour: 'text-neutral-950', heading: 'Email verified',                  body: 'Your email has been verified. Your BookStore account is ready.',            cta: { label: 'Continue to Login', to: '/login' } },
  [STATES.alreadyVerified]: { icon: CheckCircle2, colour: 'text-neutral-950', heading: 'Email already verified',          body: 'Your email address is already verified. You can sign in.',                cta: { label: 'Continue to Login', to: '/login' } },
  [STATES.invalidToken]:    { icon: XCircle,      colour: 'text-neutral-500', heading: 'Verification link is invalid',    body: 'This link may be incorrect or already used. Check your email.',           cta: { label: 'Go to Login',        to: '/login' } },
  [STATES.expiredToken]:    { icon: Clock,        colour: 'text-neutral-500', heading: 'Verification link expired',       body: 'This link is no longer valid. Please sign up again.',                     cta: { label: 'Go to Login',        to: '/login' } },
  [STATES.missingToken]:    { icon: Mail,         colour: 'text-neutral-500', heading: 'Verification link is missing',    body: 'Please check your inbox and click the link in the email from BookStore.', cta: { label: 'Go to Login',        to: '/login' } },
  [STATES.unknownError]:    { icon: AlertCircle,  colour: 'text-neutral-500', heading: 'Verification failed',             body: 'We were unable to verify your email. Please try again.',                  cta: { label: 'Go to Login',        to: '/login' } },
};

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token          = searchParams.get('token');
  const [state, setState] = useState(token ? STATES.loading : STATES.missingToken);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await verifyEmail(token);
        if (cancelled) return;
        setState(codeToState(result.code, result.ok));
      } catch {
        if (!cancelled) setState(STATES.unknownError);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const config = STATE_CONFIG[state];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-16" style={{ fontFamily: 'var(--font-sans)' }}>
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="ve-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#ve-dot-grid)" />
      </svg>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease }} className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-center border-b border-neutral-100 px-8 py-6">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2" aria-label="BookStore">
              <img src={bookstoreLogo} alt="BookStore" className="h-6 w-6" />
              <span className="text-[18px] font-semibold tracking-tight text-neutral-950">BookStore</span>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-6 px-8 py-10 text-center">
            {state === STATES.loading ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50">
                  <Loader2 size={28} strokeWidth={1.75} className="animate-spin text-neutral-600" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">Verifying your email…</h1>
                  <p className="text-[14px] leading-relaxed text-neutral-500">Please wait while we confirm your email address.</p>
                </div>
              </>
            ) : (
              <>
                <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45, ease }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50">
                  <config.icon size={28} strokeWidth={1.75} className={config.colour} aria-hidden="true" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }} className="flex flex-col gap-2">
                  <h1 className="text-[1.15rem] font-bold tracking-tight text-neutral-950">{config.heading}</h1>
                  <p className="text-[14px] leading-[1.75] text-neutral-500">{config.body}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2, ease }}>
                  <Link to={config.cta.to} className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-8 text-[14.5px] font-semibold text-white transition hover:bg-black hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
                    {config.cta.label}
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
        <p className="mt-6 text-center text-[12.5px] text-neutral-400">
          Need help?{' '}
          <Link to="/contact" className="font-medium text-neutral-600 underline underline-offset-4 transition hover:text-neutral-950">Contact support</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
