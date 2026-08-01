import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import { AUTH_MESSAGES } from '../constants/messages';
import { validateSignupForm } from '../utils/validation';
import { useForm } from '../hooks/useForm';
import { useState } from 'react';
import bookstoreLogo from '../assets/bookstorelogo.svg';
import libraryImage from '../assets/library.svg';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { form, error, loading, handleChange, handleSubmit, setError } = useForm(
    { name: '', email: '', password: '' },
    async (formData) => {
      // Check if user agreed
      if (!agreed) {
        setError(AUTH_MESSAGES.SIGNUP_AGREE_ERROR);
        return;
      }

      // Validate form
      const validation = validateSignupForm(formData.name, formData.email, formData.password);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      // Register
      await registerUser(formData);
      navigate('/login');
    }
  );

  return (
    <div className="auth-split">

      {/* ══ LEFT ══ */}
      <div className="auth-split__left">

        <Link to="/" className="auth-split__logo">
          <img src={bookstoreLogo} alt="BooksStore" className="auth-split__logo-img" />
          <span className="auth-split__logo-text">BooksStore</span>
        </Link>

        <div className="auth-split__header">
          <h1 className="auth-split__title">{AUTH_MESSAGES.SIGNUP_TITLE}</h1>
          <p className="auth-split__sub">{AUTH_MESSAGES.SIGNUP_SUBTITLE}</p>
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
            <span className="auth-split__field-label">{AUTH_MESSAGES.SIGNUP_NAME_LABEL}</span>
            <input
              name="name"
              type="text"
              placeholder={AUTH_MESSAGES.SIGNUP_NAME_PLACEHOLDER}
              value={form.name}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-split__field">
            <span className="auth-split__field-label">{AUTH_MESSAGES.SIGNUP_EMAIL_LABEL}</span>
            <input
              name="email"
              type="email"
              placeholder={AUTH_MESSAGES.SIGNUP_EMAIL_PLACEHOLDER}
              value={form.email}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-split__field">
            <span className="auth-split__field-label">{AUTH_MESSAGES.SIGNUP_PASSWORD_LABEL}</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={AUTH_MESSAGES.SIGNUP_PASSWORD_PLACEHOLDER}
              value={form.password}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="new-password"
              minLength={6}
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

          <label className="auth-split__terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="auth-split__checkbox"
            />
            <span>
              {AUTH_MESSAGES.SIGNUP_TERMS}{' '}
              <Link to="/" className="auth-split__terms-link">
                {AUTH_MESSAGES.SIGNUP_TERMS_SERVICE}
              </Link>
              {' '}and{' '}
              <Link to="/" className="auth-split__terms-link">
                {AUTH_MESSAGES.SIGNUP_PRIVACY}
              </Link>.
            </span>
          </label>

          <div className="auth-split__actions">
            <button
              type="submit"
              className="auth-split__btn auth-split__btn--primary"
              disabled={loading}
            >
              {loading ? AUTH_MESSAGES.SIGNUP_CREATING : AUTH_MESSAGES.SIGNUP_BUTTON}
            </button>
          </div>
        </form>

        <p className="auth-split__switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-split__switch-link">
            Sign in
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

export default Signup;