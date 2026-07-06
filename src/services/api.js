const API_URL = import.meta.env.VITE_API_URL;

// ========== SESSION HELPERS ==========
// The token and user get saved in localStorage so the login "sticks"
// even after a page refresh. We read them back out whenever we need them.

export function saveSession({ token, user }) {
  localStorage.setItem('bookstowa_token', token);
  localStorage.setItem('bookstowa_user', JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem('bookstowa_token');
}

export function getUser() {
  const raw = localStorage.getItem('bookstowa_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem('bookstowa_token');
  localStorage.removeItem('bookstowa_user');
}

// ========== BACKEND STATUS CHECK ==========
// GET /api/books requires a valid token (it's behind `authenticate` on the
// backend). So: no token -> always 401 -> "offline". With a token -> 200 -> "connected".

export async function checkBackendStatus() {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/api/books`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// ========== AUTH ==========

async function authRequest(path, body) {
  const response = await fetch(`${API_URL}/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Validation errors: { message: 'Validation failed', errors: [...] }
    // Auth failures:      { message: 'Invalid email or password' }
    const detail = data.errors ? data.errors.join(' ') : data.message;
    throw new Error(detail || 'Something went wrong. Please try again.');
  }

  return data;
}

export function registerUser({ name, email, password }) {
  // Returns { message, user } - account created, but NOT logged in yet
  return authRequest('register', { name, email, password });
}

export function loginUser({ email, password }) {
  // Returns { message, token, user } - token lasts 24h
  return authRequest('login', { email, password });
}