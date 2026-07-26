import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowUpRight, Clock } from "lucide-react";

/* ─────────────────────────────────────────
   Category colour token — always monochrome
───────────────────────────────────────── */
function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
      {category}
    </span>
  );
}

/* ─────────────────────────────────────────
   Monochrome visual placeholder when no
   cover image is available
───────────────────────────────────────── */
function CoverPlaceholder({ title }) {
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-50">
      {/* Abstract book icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="text-neutral-300"
      >
        <rect x="6" y="4" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="4" width="5" height="32" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="14" y="12" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.4" />
        <rect x="14" y="16" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.3" />
        <rect x="14" y="20" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.25" />
        <rect x="14" y="24" width="8"  height="1.5" rx="0.75" fill="currentColor" opacity="0.2"  />
      </svg>
      <span className="text-[13px] font-semibold tracking-tight text-neutral-400">
        {initials}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   NewsCard
───────────────────────────────────────── */
export function NewsCard({ article, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.62, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
    >
      <Link
        to={`/news/${article.slug}`}
        className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
        aria-label={`Read: ${article.title}`}
      >
        {/* Cover image / placeholder */}
        <div className="relative h-48 overflow-hidden bg-neutral-50">
          {article.coverImage ? (
            <motion.img
              src={article.coverImage}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <motion.div
              className="h-full w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <CoverPlaceholder title={article.title} />
            </motion.div>
          )}

          {/* Category badge overlaid on image */}
          <div className="absolute left-4 top-4">
            <CategoryBadge category={article.category} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          {/* Title */}
          <h3 className="text-[16px] font-bold leading-snug tracking-tight text-neutral-950 transition-colors duration-200 group-hover:text-neutral-700">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-3 text-[13.5px] leading-[1.75] text-neutral-500">
            {article.excerpt}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-neutral-100 pt-4">
            <span className="flex items-center gap-1.5 text-[12px] text-neutral-400">
              <Calendar size={11} strokeWidth={2} aria-hidden="true" />
              {article.date}
            </span>
            {article.location && (
              <span className="flex items-center gap-1.5 text-[12px] text-neutral-400">
                <MapPin size={11} strokeWidth={2} aria-hidden="true" />
                {article.location}
              </span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1.5 text-[12px] text-neutral-400">
                <Clock size={11} strokeWidth={2} aria-hidden="true" />
                {article.readTime}
              </span>
            )}

            {/* Read more arrow — pushed to the right */}
            <span className="ml-auto flex items-center gap-1 text-[12.5px] font-semibold text-neutral-700 transition-colors duration-200 group-hover:text-neutral-950">
              Read story
              <ArrowUpRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default NewsCard;
