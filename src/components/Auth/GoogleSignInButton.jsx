import { useEffect, useRef, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GIS_SCRIPT_URL   = 'https://accounts.google.com/gsi/client';
const SCRIPT_ID        = 'google-gis-script';

/**
 * GoogleSignInButton
 *
 * Uses google.accounts.id.renderButton() — Google's officially-supported
 * approach that works reliably on desktop AND mobile (Android Chrome,
 * iPhone Safari).
 *
 * Why NOT google.accounts.id.prompt():
 *   - prompt() triggers One Tap, a floating overlay UI.
 *   - Mobile browsers (especially Safari) routinely block or ignore it.
 *   - It is not triggered by a user gesture in the traditional sense,
 *     so mobile browsers may suppress it entirely.
 *
 * Why renderButton() works on mobile:
 *   - Google renders their own <button> inside our container div.
 *   - It is a real user-gesture-initiated click, not a floating prompt.
 *   - Google's own rendered button handles the OAuth flow correctly
 *     across all supported browsers including mobile Safari and Chrome.
 *
 * The credential callback is identical — the same ID token is produced
 * and sent to the backend via googleLogin(credential).
 *
 * Props:
 *   onSuccess(credential) — called with the Google ID token string
 *   onError(message)      — called on error
 *   disabled              — prevents interaction while a request is running
 *   label                 — ignored (Google controls the button text in this mode)
 */
function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}) {
  const containerRef  = useRef(null);
  const initialized   = useRef(false);
  const [ready,       setReady]       = useState(false);
  const [scriptError, setScriptError] = useState(false);

  /* Keep stable callback refs so we can re-initialize if they change */
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef   = useRef(onError);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { onErrorRef.current  = onError;  }, [onError]);

  /* ── 1. Load the GIS script ── */
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error(
        '[BookStore] VITE_GOOGLE_CLIENT_ID is not set. ' +
        'Add it to your .env and restart the dev server.'
      );
      setScriptError(true);
      return;
    }

    /* GIS already available (e.g. second mount / hot-reload) */
    if (window.google?.accounts?.id) {
      setReady(true);
      return;
    }

    /* Script tag already injected — just wait for it */
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      const onLoad  = () => setReady(true);
      const onErr   = () => setScriptError(true);
      existing.addEventListener('load',  onLoad);
      existing.addEventListener('error', onErr);
      return () => {
        existing.removeEventListener('load',  onLoad);
        existing.removeEventListener('error', onErr);
      };
    }

    /* First time — inject the script */
    const script    = document.createElement('script');
    script.id       = SCRIPT_ID;
    script.src      = GIS_SCRIPT_URL;
    script.async    = true;
    script.defer    = true;
    script.onload   = () => setReady(true);
    script.onerror  = () => {
      console.error('[BookStore] Failed to load Google Identity Services.');
      setScriptError(true);
    };
    document.head.appendChild(script);
  }, []);

  /* ── 2. Initialize GIS + render the button once script is ready ── */
  useEffect(() => {
    if (!ready || !containerRef.current || !window.google?.accounts?.id) return;

    /* Initialize (safe to call multiple times — GIS guards internally) */
    window.google.accounts.id.initialize({
      client_id:           GOOGLE_CLIENT_ID,
      callback:            handleCredentialResponse,
      auto_select:         false,
      cancel_on_tap_outside: true,
    });

    /* Render Google's own button into our container div.
       This is the key change: renderButton() produces a real clickable
       button that works on all browsers including mobile Safari. */
    window.google.accounts.id.renderButton(containerRef.current, {
      type:   'standard',
      theme:  'outline',
      size:   'large',
      text:   'continue_with',
      shape:  'rectangular',
      width:  containerRef.current.offsetWidth || 460,
      locale: 'en',
    });

    initialized.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function handleCredentialResponse(response) {
    if (response.error) {
      const msg = friendlyGoogleError(response.error);
      onErrorRef.current?.(msg);
      return;
    }
    if (response.credential) {
      onSuccessRef.current?.(response.credential);
    }
  }

  /* ── Dev-only: missing client ID ── */
  if (scriptError && !GOOGLE_CLIENT_ID) {
    return (
      <p className="auth-google__config-error" role="alert">
        Google Sign-In is not configured.{' '}
        Add <code>VITE_GOOGLE_CLIENT_ID</code> to your <code>.env</code> file.
      </p>
    );
  }

  /* ── Script load error ── */
  if (scriptError) {
    return (
      <p className="auth-google__config-error" role="alert">
        Unable to load Google Sign-In. Check your internet connection and try again.
      </p>
    );
  }

  return (
    /*
      The outer wrapper preserves the same max-width as the rest of the
      auth form (460 px) and handles the disabled overlay.

      IMPORTANT: pointer-events must NOT be disabled on the container or
      Google's rendered button will be unclickable on mobile.
      We use a lightweight opacity + non-interactive overlay approach
      instead of `pointer-events: none` on the container itself.
    */
    <div
      className="auth-google__wrapper"
      aria-label="Continue with Google"
      style={{ position: 'relative', width: '100%', maxWidth: '460px' }}
    >
      {/* Google renders their button into this div */}
      <div
        ref={containerRef}
        className="auth-google__gis-container"
        style={{
          /* Let Google's button fill the wrapper */
          width: '100%',
          minHeight: '44px',
          opacity: !ready ? 0 : disabled ? 0.55 : 1,
          transition: 'opacity 0.2s',
        }}
        aria-hidden={!ready}
      />

      {/* Loading placeholder — shown while GIS script loads */}
      {!ready && (
        <div
          className="auth-google__btn"
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, cursor: 'default' }}
        >
          <svg className="auth-google__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Loading…</span>
        </div>
      )}

      {/* Disabled overlay — covers clicks without removing pointer events
          from Google's button (which would break mobile tap) */}
      {disabled && ready && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'not-allowed',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}

/* ── Human-readable Google error messages ── */
function friendlyGoogleError(code) {
  switch (code) {
    case 'popup_closed_by_user':
    case 'user_cancel':
      return 'Google sign-in was cancelled.';
    case 'popup_blocked_by_browser':
      return 'The sign-in window was blocked by your browser. Please allow popups for this site and try again.';
    case 'access_denied':
      return 'Access was denied. Please try again and allow BookStore to access your Google account.';
    case 'immediate_failed':
      return 'Automatic sign-in is not available. Please tap "Continue with Google" to sign in.';
    default:
      return 'Google sign-in was unsuccessful. Please try again.';
  }
}

export default GoogleSignInButton;
