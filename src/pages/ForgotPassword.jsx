import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { forgotPassword } from '../services/api';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryIllustration from '../assets/library.svg';

const ease = [0.22, 1, 0.36, 1];

function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    setMessage('');
    try {
      await forgotPassword(email.trim());
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="auth-split" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Left panel ── */}
      <div className="auth-split__left">
        <div className="auth-split__left-inner">

          {/* Logo */}
          <Link to="/" className="auth-split__logo" aria-label="BookStore home">
            <img src={bookstoreLogo} alt="" className="h-6 w-6" aria-hidden="true" />
            <span>BookStore</span>
          </Link>

          {/* Back to login */}
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-[13.5px] font-medium text-neutral-500 transition-colors hover:text-neutral-950 focus:outline-none"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to login
          </Link>

          {status === 'success' ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
              className="flex flex-col gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950">
                <Mail size={20} strokeWidth={1.75} className="text-white" aria-hidden="true" />
              </div>
              <h1 className="text-[1.6rem] font-bold tracking-tight text-neutral-950">
                Check your inbox.
              </h1>
              <p className="text-[15px] leading-[1.75] text-neutral-500">
                If an account with that email exists, we sent a password reset link.
                It expires in <strong className="text-neutral-700">1 hour</strong>.
              </p>
              <p className="text-[13.5px] text-neutral-400">
                Did not receive it?{' '}
                <button
                  type="button"
                  onClick={() => { setStatus('idle'); setEmail(''); }}
                  className="font-medium text-neutral-700 underline underline-offset-4 transition hover:text-neutral-950 focus:outline-none"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <h1 className="mb-2 text-[1.6rem] font-bold tracking-tight text-neutral-950">
                Forgot your password?
              </h1>
              <p className="mb-8 text-[15px] leading-[1.75] text-neutral-500">
                Enter your email and we will send you a reset link.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-split__field">
                  <label htmlFor="fp-email" className="auth-split__label">
                    Email address
                  </label>
                  <input
                    id="fp-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                    placeholder="you@example.com"
                    required
                    disabled={status === 'loading'}
                    autoComplete="email"
                    className="auth-split__input"
                  />
                </div>

                {status === 'error' && message && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 text-[13px] text-red-500"
                    role="alert"
                  >
                    {message}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="auth-split__btn"
                  aria-busy={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Right panel — illustration ── */}
      <div className="auth-split__right" aria-hidden="true">
        <img src={libraryIllustration} alt="" className="auth-split__illustration" />
      </div>

    </div>
  );
}

export default ForgotPassword;
