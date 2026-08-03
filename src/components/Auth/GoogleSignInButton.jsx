import { useEffect, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GIS_SCRIPT_URL   = 'https://accounts.google.com/gsi/client';
const SCRIPT_ID        = 'google-gis-script';

/**
 * GoogleSignInButton
 *
 * Props:
 *   onSuccess(credential) — called with the raw Google ID token string
 *                           after successful sign-in
 *   onError(message)      — called when sign-in fails
 *   disabled              — prevent interaction while a request is in flight
 *   label                 — button text (default: "Continue with Google")
 */
function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
  label = 'Continue with Google',
}) {
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const initialized  = useRef(false);

  /* ── Load GIS script once ── */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        '[BookStore] VITE_GOOGLE_CLIENT_ID is not set. ' +
        'Add it to your .env file and restart the dev server.'
      );
      setScriptError(true);
      return;
    }

    // If GIS is already loaded (e.g. hot-reload), skip injection
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }

    // Avoid injecting the same script twice
    if (document.getElementById(SCRIPT_ID)) {
      // Script tag exists but may still be loading — wait for load event
      const existing = document.getElementById(SCRIPT_ID);
      existing.addEventListener('load', () => setScriptReady(true));
      existing.addEventListener('error', () => setScriptError(true));
      return;
    }

    const script  = document.createElement('script');
    script.id     = SCRIPT_ID;
    script.src    = GIS_SCRIPT_URL;
    script.async  = true;
    script.defer  = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => {
      console.error('[BookStore] Failed to load Google Identity Services script.');
      setScriptError(true);
    };
    document.head.appendChild(script);
  }, []);

  /* ── Initialize GIS once script is ready ── */
  useEffect(() => {
    if (!scriptReady || initialized.current || !window.google?.accounts?.id) return;
    initialized.current = true;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.error) {
          onError?.(response.error);
          return;
        }
        if (response.credential) {
          onSuccess?.(response.credential);
        }
      },
      // Disable automatic One Tap prompt — we use the explicit button trigger
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, [scriptReady, onSuccess, onError]);

  /* ── Handle button click ── */
  function handleClick() {
    if (disabled || !scriptReady || scriptError) return;

    if (!window.google?.accounts?.id) {
      onError?.('Google Sign-In is not available right now. Please try again.');
      return;
    }

    // Prompt the Google One Tap / popup flow
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // One Tap was blocked (e.g. user dismissed it too many times).
        // Fall back to showing a standard OAuth popup.
        window.google.accounts.id.renderButton(
          document.createElement('div'),
          { type: 'standard', theme: 'outline', size: 'large' }
        );
        onError?.(
          'Google Sign-In popup was blocked. Please check your browser settings.'
        );
      }
    });
  }

  if (scriptError && !GOOGLE_CLIENT_ID) {
    return (
      <p className="auth-google__config-error" role="alert">
        Google Sign-In is not configured. Add{' '}
        <code>VITE_GOOGLE_CLIENT_ID</code> to your <code>.env</code> file.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !scriptReady || scriptError}
      className="auth-google__btn"
      aria-label="Continue with Google"
    >
      {/* Official Google G logo SVG — required by Google branding guidelines */}
      <svg
        className="auth-google__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>

      <span>{scriptReady ? label : 'Loading…'}</span>
    </button>
  );
}

export default GoogleSignInButton;
