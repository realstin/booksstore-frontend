/**
 * components/Auth/ErrorBanner.jsx
 * ─────────────────────────────────────────────────────────────────
 * Animated inline error banner used across all auth forms.
 * Returns null when message is empty so callers don't need to
 * conditionally render it themselves.
 * ─────────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from 'framer-motion';

/**
 * @param {object}  props
 * @param {string}  props.message  - Error text to display. Renders nothing if falsy.
 * @param {string}  [props.className] - Optional extra Tailwind classes on the wrapper.
 */
function ErrorBanner({ message, className = '' }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          role="alert"
          aria-live="polite"
          className={`flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13.5px] text-red-700 ${className}`}
        >
          {/* Warning icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
            <line
              x1="7" y1="4.5" x2="7" y2="7.5"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
            />
            <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
          </svg>

          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorBanner;
