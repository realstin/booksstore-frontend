import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the terms of service to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await registerUser(form);
      navigate('/login');
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
          <h1 className="auth-split__title">Sign Up</h1>
          <p className="auth-split__sub">You are a step away from something great!</p>
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
            <span className="auth-split__field-label">Name</span>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-split__field">
            <span className="auth-split__field-label">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="auth-split__input"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-split__field">
            <span className="auth-split__field-label">Password</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
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
            I agree to the{' '}
            <Link to="/" className="auth-split__terms-link">
            Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/" className="auth-split__terms-link">
            Privacy Policy
            </Link>.
            </span>
            </label>

          <div className="auth-split__actions">
            <button
              type="submit"
              className="auth-split__btn auth-split__btn--primary"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
            <Link to="/login" className="auth-split__btn auth-split__btn--outline">
              Log in
            </Link>
          </div>
        </form>

        <p className="auth-split__motto">Read · Learn · Rest · Grow</p>
      </div>

      {/* ══ RIGHT ══ */}
      <div className="auth-split__right" aria-hidden="true">
        <img src="/library.svg" alt="" className="auth-split__illustration" />
      </div>

    </div>
  );
}

export default Signup;
