import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal, Sun, Moon, Monitor,
  LayoutGrid, List, BookOpen, BookMarked,
  Mail, Shield, Minus, RotateCcw, AlertTriangle,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { prefs, DEFAULTS } from '../../utils/preferences';

/* ─────────────────────────────────────────
   Easing
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease },
});

/* ─────────────────────────────────────────
   Apply theme to <html> element
───────────────────────────────────────── */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    root.removeAttribute('data-theme');
  } else {
    // system — respect OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
}

/* ─────────────────────────────────────────
   Section wrapper
───────────────────────────────────────── */
function SettingsSection({ id, title, description, delay = 0, children }) {
  return (
    <motion.section {...fadeUp(delay)} aria-labelledby={id}>
      <div className="mb-4">
        <h2 id={id} className="text-[15px] font-bold tracking-tight text-neutral-950">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-[13px] text-neutral-400">{description}</p>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────
   Settings row — standard
───────────────────────────────────────── */
function SettingsRow({ icon: Icon, label, description, action, last = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-6 py-4 ${!last ? 'border-b border-neutral-100' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-500">
            <Icon size={14} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-neutral-900">{label}</p>
          {description && (
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-neutral-400">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Toggle switch
───────────────────────────────────────── */
function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
        checked ? 'bg-neutral-950' : 'bg-neutral-200',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform duration-200',
          checked ? 'left-[1.375rem]' : 'left-0.5',
        ].join(' ')}
        aria-hidden="true"
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   Segmented control
───────────────────────────────────────── */
function SegmentedControl({ value, onChange, options }) {
  return (
    <div
      className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1"
      role="group"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={[
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900',
            value === opt.value
              ? 'bg-white text-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'text-neutral-500 hover:text-neutral-700',
          ].join(' ')}
        >
          {opt.icon && <opt.icon size={13} strokeWidth={2} aria-hidden="true" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Deferred action row
───────────────────────────────────────── */
function DeferredRow({ icon: Icon, label, note, last = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-6 py-4 ${!last ? 'border-b border-neutral-100' : ''}`}>
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 text-neutral-400">
            <Icon size={14} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
        <div>
          <p className="text-[14px] font-medium text-neutral-500">{label}</p>
          {note && <p className="mt-0.5 text-[12px] text-neutral-400">{note}</p>}
        </div>
      </div>
      <span className="shrink-0 rounded-full border border-neutral-100 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
        Coming soon
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reset confirmation (no alert())
───────────────────────────────────────── */
function ResetConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-6 mb-4 mt-1 flex flex-col items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
      role="alertdialog"
      aria-label="Reset preferences confirmation"
    >
      <p className="text-[13.5px] text-neutral-700">
        Reset all preferences to their defaults? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1.5 text-[13px] font-medium text-neutral-600 transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Settings page
───────────────────────────────────────── */
function Settings() {
  const { user } = useAuth();

  /* Load all prefs on mount */
  const [theme,        setThemeState]   = useState(() => prefs.getTheme());
  const [reduceMotion, setReduceMotion] = useState(() => prefs.getReduceMotion());
  const [libraryView,  setLibraryView]  = useState(() => prefs.getLibraryView());
  const [bookOpening,  setBookOpening]  = useState(() => prefs.getBookOpening());
  const [showReset,    setShowReset]    = useState(false);

  /* Apply theme on mount and whenever it changes */
  useEffect(() => { applyTheme(theme); }, [theme]);

  /* Watch system theme changes when "system" is selected */
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  /* ── Handlers ── */
  function handleTheme(v) {
    setThemeState(v);
    prefs.setTheme(v);
    applyTheme(v);
  }

  function handleReduceMotion(v) {
    setReduceMotion(v);
    prefs.setReduceMotion(v);
  }

  function handleLibraryView(v) {
    setLibraryView(v);
    prefs.setLibraryView(v);
  }

  function handleBookOpening(v) {
    setBookOpening(v);
    prefs.setBookOpening(v);
  }

  function handleReset() {
    prefs.resetAll();
    const d = {
      theme:        DEFAULTS.theme,
      reduceMotion: DEFAULTS.reduceMotion,
      libraryView:  DEFAULTS.libraryView,
      bookOpening:  DEFAULTS.bookOpening,
    };
    setThemeState(d.theme);
    setReduceMotion(d.reduceMotion);
    setLibraryView(d.libraryView);
    setBookOpening(d.bookOpening);
    applyTheme(d.theme);
    setShowReset(false);
  }

  const themeOptions = [
    { value: 'light',  label: 'Light',  icon: Sun     },
    { value: 'dark',   label: 'Dark',   icon: Moon    },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const viewOptions = [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: List       },
  ];

  const openOptions = [
    { value: 'details', label: 'Book Details', icon: BookMarked },
    { value: 'read',    label: 'Read Online',  icon: BookOpen   },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Header ── */}
      <header className="mb-10">
        <motion.p {...fadeUp(0)}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Your Workspace
        </motion.p>
        <motion.h1 {...fadeUp(0.07)}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950">
          Settings
        </motion.h1>
        <motion.p {...fadeUp(0.13)}
          className="max-w-md text-[1rem] leading-[1.75] text-neutral-500">
          Customize your BookStore experience.
        </motion.p>
      </header>

      <div className="flex flex-col gap-8">

        {/* ── Appearance ── */}
        <SettingsSection
          id="appearance-heading"
          title="Appearance"
          description="Choose how BookStore looks and behaves on your device."
          delay={0.18}
        >
          <SettingsRow
            icon={Sun}
            label="Theme"
            description="Switch between light, dark, or match your system."
            action={
              <SegmentedControl
                value={theme}
                onChange={handleTheme}
                options={themeOptions}
              />
            }
          />
          <SettingsRow
            icon={SlidersHorizontal}
            label="Reduce motion"
            description="Reduce animations throughout BookStore."
            last
            action={
              <Toggle
                checked={reduceMotion}
                onChange={handleReduceMotion}
                label="Toggle reduce motion"
              />
            }
          />
        </SettingsSection>

        {/* ── Reading ── */}
        <SettingsSection
          id="reading-heading"
          title="Reading"
          description="Choose how you prefer to discover and organize books."
          delay={0.24}
        >
          <SettingsRow
            icon={LayoutGrid}
            label="Library view"
            description="Choose how saved books are displayed in your library."
            action={
              <SegmentedControl
                value={libraryView}
                onChange={handleLibraryView}
                options={viewOptions}
              />
            }
          />
          <SettingsRow
            icon={BookOpen}
            label="When opening a book"
            description="Choose what happens when you click a book."
            last
            action={
              <SegmentedControl
                value={bookOpening}
                onChange={handleBookOpening}
                options={openOptions}
              />
            }
          />
        </SettingsSection>

        {/* ── Account ── */}
        <SettingsSection
          id="account-heading"
          title="Account"
          description="Your account details and security settings."
          delay={0.3}
        >
          <SettingsRow
            icon={Mail}
            label="Email"
            description={user?.email ?? '—'}
          />
          <SettingsRow
            icon={Shield}
            label="Role"
            description={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}
          />
          <DeferredRow
            icon={Mail}
            label="Change email"
            note="Email verification will be required."
          />
          <DeferredRow
            icon={Lock}
            label="Password & Security"
            note="Security controls will be available in a future update."
            last
          />
        </SettingsSection>

        {/* ── Danger Zone ── */}
        <SettingsSection
          id="danger-heading"
          title="Danger Zone"
          delay={0.36}
        >
          <DeferredRow
            icon={AlertTriangle}
            label="Delete account"
            note="Permanent account deletion will be available in a future update."
            last
          />
        </SettingsSection>

        {/* ── Reset preferences ── */}
        <motion.div {...fadeUp(0.42)}>
          {showReset ? (
            <ResetConfirm
              onConfirm={handleReset}
              onCancel={() => setShowReset(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 underline underline-offset-4 transition hover:text-neutral-700 focus:outline-none focus-visible:text-neutral-700"
            >
              <RotateCcw size={12} strokeWidth={2} aria-hidden="true" />
              Reset preferences to defaults
            </button>
          )}
        </motion.div>

        {/* ── Footer note ── */}
        <motion.p {...fadeUp(0.46)}
          className="text-[12.5px] leading-relaxed text-neutral-400">
          Your preferences help us make BookStore better. More workspace
          controls will be added based on how learners use the platform.
        </motion.p>

      </div>
    </div>
  );
}

export default Settings;
