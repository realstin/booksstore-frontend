/**
 * components/Auth/OrDivider.jsx
 * ─────────────────────────────────────────────────────────────────
 * "── or ──" visual divider used between the email/password form
 * and the Google sign-in button on auth pages.
 * ─────────────────────────────────────────────────────────────────
 */

function OrDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-neutral-200" />
      <span className="text-[12px] font-semibold uppercase tracking-widest text-neutral-400">
        or
      </span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

export default OrDivider;
