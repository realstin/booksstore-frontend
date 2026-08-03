import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleLogin } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import { AUTH_MESSAGES } from '../constants/messages';
import { validateLoginForm } from '../utils/validation';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage from '../assets/library.svg';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

/* ── Translate raw backend/network error messages into user-friendly text ── */
function friendlyAuthError(raw) {
  if (!raw) return 'Something went wrong. Please try again.';
  const msg = raw.toLowerCase();

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch'))
    return 'Network connection problem. Please check your internet connection and try again.';

  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email already'))
    return 'This email is already registered with a password. Please sign in with your email and password instead.';

  if (msg.includes('invalid credential') || msg.includes('invalid token') || msg.includes('could not verify'))
    return 'This Google account could not be verified. Please try again.';

  if (msg.includes('not found') || msg.includes('no account'))
    return 'No BookStore account found for this Google account. Please sign up first.';

  /* If the backend already sent a clean user-facing message, use it directly
     (it won't contain technical keywords above) */
  if (raw.length < 120 && !raw.includes('Error:') && !raw.includes('JWT') && !raw.includes('mongoose'))
    return raw;

  return "We couldn't sign you in with Google. Please try again.";
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState('');

  const { form, error, loading, handleChange, handleSubmit, setError } = useForm(
    { email: '', password: '' },
    async (formData) => {
      const validation = validateLoginForm(formData.email, formData.password);
      if (!validation.valid) { setError(validation.error); return; }
      const data = await loginUser(formData);
      login(data);
      navigate('/dashboard');
    }
  );

  async function handleGoogleSuccess(credential) {
    if (googleLoading) return;
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const data = await googleLogin(credential);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setGoogleError(friendlyAuthError(err.message));
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleGoogleError(msg) {
    setGoogleError(msg || 'Google sign-in was cancelled.');
  }

  const isBusy = loading || googleLoading;

  return (
    <div className="auth-split">

      {/* ══ LEFT ══ */}
      <div className="auth-split__left">

        <Link to="/" className="auth-split__logo">
          <img src={bookstoreLogo} alt="BooksStore" className="auth-split__logo-img" />
          <span className="auth-split__logo-text">BooksStore</span>
        </Link>

        <div className="auth-split__header">
          <h1 className="auth-split__title">{AUTH_MESSAGES.LOGIN_TITLE}</h1>
          <p className="auth-split__sub">{AUTH_MESSAGES.LOGIN_SUBTITLE}</p>
        </div>

        {error && (
          <div className="auth-split__error" role="alert">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              <line x1="7" y1="4.5" x2="7" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
            </svg>
            {error}
          </div>
        )}

        <form className="auth-split__form" onSubmit={handleSubmit} noValidate>

          <div className="auth-split__field">
            <span className="auth-split__field-label">{AUTH_MESSAGES.LOGIN_EMAIL_LABEL}</span>
            <input
              name="email"
              type="email"
              placeholder={AUTH_MESSAGES.LOGIN_EMAIL_PLACEHOLDER}
              value={form.email}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-split__field">
            <span className="auth-split__field-label">{AUTH_MESSAGES.LOGIN_PASSWORD_LABEL}</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={AUTH_MESSAGES.LOGIN_PASSWORD_PLACEHOLDER}
              value={form.password}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-split__eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          <div className="auth-split__actions">
            <button
              type="submit"
              className="auth-split__btn auth-split__btn--primary"
              disabled={isBusy}
            >
              {loading ? AUTH_MESSAGES.LOGIN_SIGNING_IN : AUTH_MESSAGES.LOGIN_BUTTON}
            </button>
          </div>
        </form>

        {/* OR divider */}
        <div className="auth-or">
          <span className="auth-or__line" aria-hidden="true" />
          <span className="auth-or__text">or</span>
          <span className="auth-or__line" aria-hidden="true" />
        </div>

        {/* Google error */}
        {googleError && (
          <div className="auth-split__error" role="alert">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              <line x1="7" y1="4.5" x2="7" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
            </svg>
            {googleError}
          </div>
        )}

        {/* Google sign-in */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isBusy}
          label={googleLoading ? 'Signing in…' : 'Continue with Google'}
        />

        <p className="auth-split__switch">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-split__switch-link">
            Sign up
          </Link>
        </p>

        <p className="auth-split__motto">{AUTH_MESSAGES.MOTTO}</p>
      </div>

      {/* ══ RIGHT ══ */}
      <div className="auth-split__right" aria-hidden="true">
        <img src={libraryImage} alt="" className="auth-split__illustration" />
      </div>

    </div>
  );
}

export default Login;