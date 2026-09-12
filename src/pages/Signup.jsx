import { Link, useNavigate } from 'react-router-dom';
import { registerUser, googleLogin } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import { AUTH_MESSAGES } from '../constants/messages';
import {
  getPasswordRequirements,
  validateEmail,
  validateName,
  validatePassword,
  validateSignupForm,
} from '../utils/validation';
import { friendlyAuthError } from '../utils/authErrors';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { motion } from 'framer-motion';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage from '../assets/library.svg';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';
import ErrorBanner from '../components/Auth/ErrorBanner';
import OrDivider from '../components/Auth/OrDivider';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const { form, error, loading, handleChange, handleSubmit, setError } = useForm(
    { name: '', email: '', password: '' },
    async (formData) => {
      if (!agreed) {
        setError(AUTH_MESSAGES.SIGNUP_AGREE_ERROR);
        return;
      }

      const validation = validateSignupForm(formData.name, formData.email, formData.password);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      const data = await registerUser(formData);

      if (!data?.user) {
        throw new Error('Account created but sign-in failed. Please sign in manually.');
      }

      login(data);
      navigate('/home');
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
      setGoogleError(friendlyAuthError(err.message, 'google'));
    } finally {
      setGoogleLoading(false);
    }
  }

  const isBusy = loading || googleLoading;
  const nameValidation = form.name ? validateName(form.name) : null;
  const emailValidation = form.email ? validateEmail(form.email) : null;
  const passwordValidation = form.password ? validatePassword(form.password) : null;
  const passwordRequirements = getPasswordRequirements(form.password);
  const nextPasswordRequirement = passwordRequirements.find((requirement) => !requirement.valid && !requirement.hidden);
  const signupValid = Boolean(
    nameValidation?.valid &&
    emailValidation?.valid &&
    passwordValidation?.valid &&
    agreed
  );

  const fieldClass = (validation) =>
    `h-12 w-full rounded-xl border bg-neutral-50 px-4 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none transition-all focus:bg-white focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
      validation === null
        ? 'border-neutral-200 focus:border-neutral-400'
        : validation.valid
          ? 'border-neutral-200 focus:border-neutral-400'
          : 'border-red-300 focus:border-red-400'
    }`;

  return (
    <div className="flex min-h-screen w-full bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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

          <div className="mb-8">
            <h1 className="mb-1.5 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-neutral-950">
              {AUTH_MESSAGES.SIGNUP_TITLE}
            </h1>
            <p className="text-[15px] text-neutral-500">{AUTH_MESSAGES.SIGNUP_SUBTITLE}</p>
          </div>

          <div className="mb-5">
            <ErrorBanner message={error} />
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
                aria-invalid={nameValidation ? !nameValidation.valid : undefined}
                aria-describedby={nameValidation?.valid ? undefined : 'signup-name-error'}
                className={fieldClass(nameValidation)}
              />
              {nameValidation && !nameValidation.valid && (
                <p id="signup-name-error" role="alert" className="text-[12px] text-red-600">
                  {nameValidation.error}
                </p>
              )}
            </div>

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
                aria-invalid={emailValidation ? !emailValidation.valid : undefined}
                aria-describedby={emailValidation?.valid ? undefined : 'signup-email-error'}
                className={fieldClass(emailValidation)}
              />
              {emailValidation && !emailValidation.valid && (
                <p id="signup-email-error" role="alert" className="text-[12px] text-red-600">
                  {emailValidation.error}
                </p>
              )}
            </div>

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
                  maxLength={72}
                  required
                  aria-invalid={passwordValidation ? !passwordValidation.valid : undefined}
                  aria-describedby="signup-password-guidance"
                  className={`${fieldClass(passwordValidation)} pr-12`}
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

              {form.password && nextPasswordRequirement && (
                <p id="signup-password-guidance" className="text-[12px] text-neutral-500" aria-live="polite">
                  {nextPasswordRequirement.label}
                </p>
              )}

              {form.password && !nextPasswordRequirement && (
                <p id="signup-password-guidance" className="text-[12px] text-emerald-600" aria-live="polite">
                  Password looks good.
                </p>
              )}
            </div>

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
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
                  {AUTH_MESSAGES.SIGNUP_PRIVACY}
                </Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isBusy || !signupValid}
              className="mt-1 h-12 w-full rounded-xl bg-neutral-950 text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {loading ? AUTH_MESSAGES.SIGNUP_CREATING : AUTH_MESSAGES.SIGNUP_BUTTON}
            </button>
          </form>

          <div className="my-5"><OrDivider /></div>

          {googleError && <div className="mb-3"><ErrorBanner message={googleError} /></div>}

          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setGoogleError(msg || 'Google sign-in was cancelled.')}
            disabled={isBusy}
          />

          <p className="mt-7 text-center text-[14px] text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-neutral-950 underline underline-offset-4 transition hover:opacity-70">
              Sign in
            </Link>
          </p>
          <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
            {AUTH_MESSAGES.MOTTO}
          </p>
        </motion.div>
      </div>

      <div className="hidden overflow-hidden bg-neutral-50 lg:flex lg:w-1/2 lg:items-center lg:justify-center" aria-hidden="true">
        <img src={libraryImage} alt="" className="max-h-[72vh] w-full max-w-120 object-contain" />
      </div>
    </div>
  );
}

export default Signup;
