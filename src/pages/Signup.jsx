import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { IconEye, IconEyeOff } from '../components/Icons';



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
