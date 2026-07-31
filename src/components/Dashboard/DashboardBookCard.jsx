import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Bookmark, BookOpen } from 'lucide-react';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

/** Format large numbers: 1200 → 1.2K */
function formatCount(n) {
  if (!n && n !== 0) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

/** Extract a display category string from the categories field */
function firstCategory(categories) {
  if (!categories) return null;
  if (Array.isArray(categories)) return categories[0] ?? null;
  return String(categories).split(',')[0].trim() || null;
}

/** Format authors array or string */
function formatAuthors(authors) {
  if (!authors) return null;
  if (Array.isArray(authors)) return authors.join(', ');
  return String(authors);
}

/** 2-letter initials from a title for the fallback cover */
function titleInitials(title = '') {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/* ─────────────────────────────────────────
   Fallback cover — shown when coverImage is absent
───────────────────────────────────────── */
function FallbackCover({ title }) {
  const initials = titleInitials(title);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900">
      <BookOpen
        size={28}
        strokeWidth={1.25}
        className="text-neutral-600"
        aria-hidden="true"
      />
      {initials && (
        <span className="text-[1rem] font-bold tracking-tight text-neutral-500">
          {initials}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   DashboardBookCard
   Props:
     book      — book object from the API
     index     — position in list (used for stagger delay)
     onClick   — optional override click handler
───────────────────────────────────────── */
function DashboardBookCard({ book, index = 0, onClick }) {
  const navigate   = useNavigate();
  const category   = firstCategory(book.categories);
  const authors    = formatAuthors(book.authors);
  const savesLabel = formatCount(book.savesCount);
  const hasCover   = Boolean(book.coverImage);

  function handleClick() {
    if (onClick) { onClick(book); return; }
    if (book._id) navigate(`/dashboard/books/${book._id}`);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
      onClick={handleClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      aria-label={`${book.title}${authors ? ` by ${authors}` : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {/* ── Cover ── */}
      <div className="aspect-3/4 w-full overflow-hidden bg-neutral-100">
        {hasCover ? (
          <motion.img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
          />
        ) : (
          <FallbackCover title={book.title} />
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        {category && (
          <span className="self-start rounded-full border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-widest text-neutral-500">
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-[13.5px] font-bold leading-snug tracking-tight text-neutral-950">
          {book.title}
        </h3>

        {/* Authors */}
        {authors && (
          <p className="line-clamp-1 text-[12px] text-neutral-500">{authors}</p>
        )}

        {/* Stats row */}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {/* Rating */}
          {book.rating != null && (
            <span className="flex items-center gap-1 text-[12px] text-neutral-600">
              <Star
                size={11}
                fill="currentColor"
                strokeWidth={0}
                className="text-neutral-700"
                aria-hidden="true"
              />
              {Number(book.rating).toFixed(1)}
            </span>
          )}

          {/* Saves count */}
          {savesLabel && (
            <span className="flex items-center gap-1 text-[12px] text-neutral-500">
              <Bookmark size={11} strokeWidth={2} aria-hidden="true" />
              {savesLabel}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default DashboardBookCard;
