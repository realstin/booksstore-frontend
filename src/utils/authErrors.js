/**
 * utils/authErrors.js
 * ─────────────────────────────────────────────────────────────────
 * Maps raw API error strings to human-readable messages shown in
 * the auth UI (Login, Signup, Google sign-in flows).
 *
 * Keeping this as a pure utility function (not a component) means
 * it can be used anywhere — forms, toasts, error boundaries — without
 * importing React.
 *
 * Rules:
 *   - Never expose internal details (JWT, Mongoose, stack traces)
 *   - Keep messages concise and actionable
 *   - Fall back to the raw message only when it is already safe
 *     (short, no technical jargon, no internal identifiers)
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Convert a raw error message from the auth API into a user-friendly string.
 *
 * @param {string|null|undefined} raw  - The error message from the thrown Error
 * @param {'login'|'signup'|'google'}  [context='login']
 *        Slight wording differences depending on which flow triggered the error.
 * @returns {string}
 */
export function friendlyAuthError(raw, context = 'login') {
  if (!raw) return 'Something went wrong. Please try again.';

  const msg = raw.toLowerCase();

  // ── Network / connectivity ────────────────────────────────────────────────
  if (
    msg.includes('network') ||
    msg.includes('failed to fetch') ||
    msg.includes('fetch') ||
    msg.includes('timed out') ||
    msg.includes('abort')
  ) {
    return 'Network connection problem. Please check your internet and try again.';
  }

  // ── Duplicate account ─────────────────────────────────────────────────────
  if (
    msg.includes('already registered') ||
    msg.includes('already exists') ||
    msg.includes('email already')
  ) {
    return context === 'signup'
      ? 'This email is already registered. Please sign in instead.'
      : 'This email is already registered with a password. Please sign in with your email and password instead.';
  }

  // ── Google credential issues ──────────────────────────────────────────────
  if (
    msg.includes('invalid credential') ||
    msg.includes('invalid token') ||
    msg.includes('could not verify')
  ) {
    return 'This Google account could not be verified. Please try again.';
  }

  // ── Account not found (Google flow) ──────────────────────────────────────
  if (msg.includes('not found') || msg.includes('no account')) {
    return 'No BookStore account found for this Google account. Please sign up first.';
  }

  // ── Email not yet verified ────────────────────────────────────────────────
  if (
    msg.includes('not verified') ||
    msg.includes('verify your email') ||
    msg.includes('email_not_verified')
  ) {
    return 'Please verify your email address before signing in. Check your inbox for the verification link.';
  }

  // ── Pass through short, safe messages that don't contain technical noise ──
  const isSafe =
    raw.length < 120 &&
    !raw.includes('Error:') &&
    !raw.includes('JWT') &&
    !raw.includes('mongoose') &&
    !raw.includes('ObjectId');

  if (isSafe) return raw;

  // ── Generic fallback ──────────────────────────────────────────────────────
  return context === 'google'
    ? "We couldn't sign you in with Google. Please try again."
    : 'Something went wrong. Please try again.';
}
