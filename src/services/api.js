const API_URL = import.meta.env.VITE_API_URL;


// ========== SESSION HELPERS ==========
// The JWT token is no longer stored in localStorage.
// The backend stores it inside an HTTP-only cookie.
//
// The browser manages the cookie automatically.
// React only stores safe user information for UI purposes.

export function saveSession({ user }) {
  localStorage.setItem('bookstowa_user', JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem('bookstowa_user');
  return raw ? JSON.parse(raw) : null;
}


export function clearSession() {
  localStorage.removeItem('bookstowa_user');
}


// ========== BACKEND STATUS CHECK ==========
// Protected routes use the HTTP-only cookie automatically.
// We do not manually attach Authorization headers anymore.
//
// credentials: "include" tells the browser:
// "Include cookies with this request."

export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`, {
      credentials: "include",
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

    headers: {
      'Content-Type': 'application/json',
    },

    // Allows browser to receive/send HTTP-only cookies
    credentials: "include",

    body: JSON.stringify(body),
  });


  const data = await response.json().catch(() => ({}));


  if (!response.ok) {

    const detail = data.errors
      ? data.errors.join(' ')
      : data.message;

    throw new Error(
      detail || 'Something went wrong. Please try again.'
    );
  }


  return data;
}


// ========== REGISTER ==========

export function registerUser({ name, email, password }) {
  return authRequest(
    'register',
    {
      name,
      email,
      password
    }
  );
}


// ========== LOGIN ==========

export function loginUser({ email, password }) {
  return authRequest(
    'login',
    {
      email,
      password
    }
  );
}

// ========== LOGOUT ==========

export async function logoutUser() {

  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });


  const data = await response.json().catch(() => ({}));


  // Remove user information stored for the UI
  clearSession();


  return data;
}