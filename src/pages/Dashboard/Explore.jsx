import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, Search, SlidersHorizontal,
  RefreshCw, ChevronDown, X,
} from 'lucide-react';
import { getBooks } from '../../services/api';
import DashboardBookCard from '../../components/Dashboard/DashboardBookCard';
import BookCardSkeleton  from '../../components/Dashboard/BookCardSkeleton';

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const SORT_OPTIONS = [
  { value: '-createdAt',  label: 'Newest'         },
  { value: '-rating',     label: 'Highest Rated'  },
  { value: '-savesCount', label: 'Most Saved'     },
];

const SKELETON_COUNT = 12;

/* ─────────────────────────────────────────
   Derive flat category list from books
───────────────────────────────────────── */
function extractCategories(books) {
  const set = new Set();
  books.forEach((b) => {
    if (!b.categories) return;
    const cats = Array.isArray(b.categories)
      ? b.categories
      : String(b.categories).split(',');
    cats.forEach((c) => { const t = c.trim(); if (t) set.add(t); });
  });
  return ['All', ...Array.from(set).sort()];
}

/* ─────────────────────────────────────────
   Client-side filter + search
───────────────────────────────────────── */
function applyFilters(books, search, category) {
  const q = search.trim().toLowerCase();
  return books.filter((b) => {
    /* Category filter */
    if (category && category !== 'All') {
      const cats = Array.isArray(b.categories)
        ? b.categories
        : String(b.categories ?? '').split(',');
      const match = cats.some((c) => c.trim().toLowerCase() === category.toLowerCase());
      if (!match) return false;
    }

    /* Search filter */
    if (!q) return true;
    const title   = (b.title ?? '').toLowerCase();
    const authors = Array.isArray(b.authors)
      ? b.authors.join(' ').toLowerCase()
      : String(b.authors ?? '').toLowerCase();
    const cats = Array.isArray(b.categories)
      ? b.categories.join(' ').toLowerCase()
      : String(b.categories ?? '').toLowerCase();

    return title.includes(q) || authors.includes(q) || cats.includes(q);
  });
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon = Compass, title, body }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      <Icon size={32} strokeWidth={1.25} className="text-neutral-300" aria-hidden="true" />
      <p className="text-[15px] font-semibold text-neutral-700">{title}</p>
      {body && <p className="max-w-xs text-[13.5px] leading-relaxed text-neutral-400">{body}</p>}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
      <RefreshCw size={28} strokeWidth={1.5} className="text-neutral-400" aria-hidden="true" />
      <p className="text-[15px] font-semibold text-neutral-700">Unable to load books right now.</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-1.5 text-[13px] font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <RefreshCw size={12} aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Explore page
───────────────────────────────────────── */
function Explore() {
  /* ── URL state (search, category, sort) ── */
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch   = searchParams.get('search')   ?? '';
  const urlCategory = searchParams.get('category') ?? 'All';
  const urlSort     = searchParams.get('sort')      ?? '-createdAt';

  /* Local UI state */
  const [search,   setSearch]   = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [sort,     setSort]     = useState(urlSort);
  const [sortOpen, setSortOpen] = useState(false);

  /* Data state */
  const [allBooks, setAllBooks] = useState([]);
  const [status,   setStatus]   = useState('loading'); // loading | success | error

  /* ── Sync URL ← state ── */
  useEffect(() => {
    const p = {};
    if (search)           p.search   = search;
    if (category !== 'All') p.category = category;
    if (sort !== '-createdAt') p.sort = sort;
    setSearchParams(p, { replace: true });
  }, [search, category, sort, setSearchParams]);

  /* ── Fetch when sort changes ── */
  const fetchBooks = useCallback(async (sortValue) => {
    setStatus('loading');
    try {
      const data = await getBooks({ sort: sortValue });
      const books = Array.isArray(data) ? data : data.books ?? [];
      setAllBooks(books);
      setStatus('success');
    } catch (err) {
      console.error('Explore fetch failed:', err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchBooks(sort);
  }, [sort, fetchBooks]);

  /* ── Derived data ── */
  const categories = useMemo(() => extractCategories(allBooks), [allBooks]);

  const filtered = useMemo(
    () => applyFilters(allBooks, search, category),
    [allBooks, search, category]
  );

  /* ── Handlers ── */
  function handleSortSelect(value) {
    setSort(value);
    setSortOpen(false);
  }

  function handleCategorySelect(cat) {
    setCategory(cat);
  }

  function clearSearch() {
    setSearch('');
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort';

  /* ── Empty state logic ── */
  const hasSearch   = search.trim().length > 0;
  const hasCatFilter = category !== 'All';
  const isEmpty = status === 'success' && allBooks.length === 0;
  const noResults = status === 'success' && allBooks.length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">

      {/* ── Page header ── */}
      <header className="mb-8">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
        >
          Explore
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06, ease }}
          className="mb-3 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950"
        >
          Discover your next great book.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.12, ease }}
          className="max-w-xl text-[1rem] leading-[1.75] text-neutral-500"
        >
          Explore books from the BookStore library, discover resources
          recommended by the community, and find something valuable for your
          next learning session.
        </motion.p>
      </header>

      {/* ── Search bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.18, ease }}
        className="relative mb-6"
      >
        <Search
          size={17}
          strokeWidth={2}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books, authors, or topics..."
          aria-label="Search the book library"
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-10 text-[14.5px] text-neutral-900 placeholder-neutral-400 shadow-[0_1px_6px_rgba(0,0,0,0.05)] outline-none transition-all focus:border-neutral-400 focus:shadow-[0_2px_12px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition hover:text-neutral-700 focus:outline-none"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>

      {/* ── Controls row: category pills + sort ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, delay: 0.24, ease }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Category pills — horizontally scrollable on mobile */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              aria-pressed={category === cat}
              className={[
                'flex-shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2',
                category === cat
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <SlidersHorizontal size={13} strokeWidth={2} aria-hidden="true" />
            {sortLabel}
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {sortOpen && (
            <motion.ul
              role="listbox"
              aria-label="Sort options"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute right-0 top-full z-20 mt-1.5 min-w-[170px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
            >
              {SORT_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sort === opt.value}
                    onClick={() => handleSortSelect(opt.value)}
                    className={[
                      'w-full px-4 py-2.5 text-left text-[13.5px] transition-colors hover:bg-neutral-50',
                      sort === opt.value
                        ? 'font-semibold text-neutral-950'
                        : 'text-neutral-600',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.div>

      {/* ── Results count ── */}
      {status === 'success' && !isEmpty && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease }}
          className="mb-5 text-[13px] text-neutral-400"
        >
          {filtered.length === 0
            ? 'No books match your search'
            : `${filtered.length} book${filtered.length !== 1 ? 's' : ''}`}
          {(hasSearch || hasCatFilter) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="ml-3 text-neutral-600 underline underline-offset-4 transition hover:text-neutral-950 focus:outline-none"
            >
              Clear filters
            </button>
          )}
        </motion.p>
      )}

      {/* ── Main content area ── */}
      {status === 'loading' && <SkeletonGrid />}

      {status === 'error' && <ErrorState onRetry={() => fetchBooks(sort)} />}

      {isEmpty && (
        <EmptyState
          icon={Compass}
          title="No books available yet."
          body="The BookStore library is growing. Check back soon for new learning resources."
        />
      )}

      {noResults && (
        <EmptyState
          icon={Search}
          title="No books found."
          body={
            hasSearch
              ? `Try searching for another title, author, or topic.`
              : hasCatFilter
              ? `No books found in the "${category}" category.`
              : 'Try adjusting your filters.'
          }
        />
      )}

      {status === 'success' && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book, i) => (
            <DashboardBookCard
              key={book._id ?? i}
              book={book}
              index={i}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Explore;
