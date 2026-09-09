import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { resetPassword } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryIllustration from '../assets/library.svg';

const ease = [0.22, 1, 0.36, 1];

function ResetPassword() {
  const [searchParams]            = useSearchParams();
  const navigate                  = useNavigate();
  const token                     = searchParams.get('token') || '';

  const [password,       setPassword]       = useState('');
  const [confirmPw,      setConfirmPw]      = useState('');
  const [showPassword,   setShowPassword]   = useState(false);
  const [showConfirm,    setShowConfirm]    = useState(false);
  const [status,         setStatus]         = useState('idle'); // idle | loading | success | error
  const [message,        setMessage]        = useState('');

  // Missing token — show error immediately
  if (!token) {
    return (
      <div className="auth-split" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="auth-split__left">
          <div className="auth-split__left-inner">
            <Link to="/" className="auth-split__logo" aria-label="BookStore home">
              <img src={bookstoreLogo} alt="" className="h-6 w-6" aria-hidden="true" />
              <span>BookStore</span>
            </Link>
            <div className="flex flex-col gap-4 pt-4">
              <XCircle size={40} className="text-red-400" aria-hidden="true" />
              <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
                Invalid reset link.
              </h1>
              <p className="text-[15px] leading-[1.75] text-neutral-500">
                This password reset link is missing or malformed. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="self-start text-[14px] font-semibold text-neutral-700 underline underline-offset-4 transition hover:text-neutral-950 focus:outline-none"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
        <div className="auth-split__right" aria-hidden="true">
          <img src={libraryIllustration} alt="" className="auth-split__illustration" />
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'loading') return;

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPw) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await resetPassword(token, password);
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

          {status === 'success' ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
              className="flex flex-col gap-4"
            >
              <CheckCircle2 size={40} className="text-emerald-500" aria-hidden="true" />
              <h1 className="text-[1.6rem] font-bold tracking-tight text-neutral-950">
                Password reset.
              </h1>
              <p className="text-[15px] leading-[1.75] text-neutral-500">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="auth-split__btn"
              >
                Go to Login
              </button>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <h1 className="mb-2 text-[1.6rem] font-bold tracking-tight text-neutral-950">
                Choose a new password.
              </h1>
              <p className="mb-8 text-[15px] leading-[1.75] text-neutral-500">
                Your new password must be at least 6 characters.
              </p>

              <form onSubmit={handleSubmit} noValidate>

                {/* New password */}
                <div className="auth-split__field">
                  <label htmlFor="rp-password" className="auth-split__label">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (status === 'error') setStatus('idle'); }}
                      placeholder="Min. 6 characters"
                      required
                      disabled={status === 'loading'}
                      autoComplete="new-password"
                      className="auth-split__input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="auth-split__field">
                  <label htmlFor="rp-confirm" className="auth-split__label">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); if (status === 'error') setStatus('idle'); }}
                      placeholder="Repeat your password"
                      required
                      disabled={status === 'loading'}
                      autoComplete="new-password"
                      className="auth-split__input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700 focus:outline-none"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                    </button>
                  </div>
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
                  {status === 'loading' ? 'Resetting…' : 'Reset Password'}
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

export default ResetPassword;
