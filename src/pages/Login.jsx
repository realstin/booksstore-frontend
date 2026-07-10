import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, saveSession } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';
import { AUTH_MESSAGES } from '../constants/messages';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(form);
      saveSession(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">

      {/* ══ LEFT ══ */}
      <div className="auth-split__left">

        <Link to="/" className="auth-split__logo">
          <img src="/bookstorelogo.svg" alt="BooksStore" className="auth-split__logo-img" />
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
              disabled={loading}
            >
              {loading ? AUTH_MESSAGES.LOGIN_SIGNING_IN : AUTH_MESSAGES.LOGIN_BUTTON}
            </button>
            <Link to="/signup" className="auth-split__btn auth-split__btn--outline">
              Sign Up
            </Link>
          </div>
        </form>

        <p className="auth-split__motto">{AUTH_MESSAGES.MOTTO}</p>
      </div>

      {/* ══ RIGHT ══ */}
      <div className="auth-split__right" aria-hidden="true">
        <img src="/library.svg" alt="" className="auth-split__illustration" />
      </div>

    </div>
  );
}

export default Login;