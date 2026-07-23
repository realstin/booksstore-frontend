import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

function CoverPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-neutral-100">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true" className="text-neutral-300">
        <rect x="8"  y="5"  width="34" height="46" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8"  y="5"  width="7"  height="46" rx="3" fill="currentColor" opacity="0.2" />
        <rect x="20" y="16" width="16" height="2"   rx="1" fill="currentColor" opacity="0.35" />
        <rect x="20" y="21" width="12" height="2"   rx="1" fill="currentColor" opacity="0.25" />
        <rect x="20" y="26" width="16" height="2"   rx="1" fill="currentColor" opacity="0.2"  />
        <rect x="20" y="31" width="10" height="2"   rx="1" fill="currentColor" opacity="0.15" />
      </svg>
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
        Featured
      </span>
    </div>
  );
}

export function FeaturedCard({ article }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.72, ease }}
      className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
      aria-label={`Featured: ${article.title}`}
    >
      <Link
        to={`/news/${article.slug}`}
        className="grid grid-cols-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset md:grid-cols-[1fr_1.1fr]"
        aria-label={`Read featured article: ${article.title}`}
      >
        {/* Left — image */}
        <div className="relative min-h-[280px] overflow-hidden md:min-h-[360px]">
          {article.coverImage ? (
            <motion.img
              src={article.coverImage}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <CoverPlaceholder />
          )}

          {/* Featured badge */}
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-semibold text-white">
              ✦ Featured
            </span>
          </div>

          {/* Category */}
          <div className="absolute bottom-5 left-5">
            <span className="inline-flex rounded-full border border-white/30 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-700 backdrop-blur-sm">
              {article.category}
            </span>
          </div>
        </div>

        {/* Right — content */}
        <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-[clamp(1.3rem,2.5vw,1.9rem)] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 transition-colors duration-200 group-hover:text-neutral-700">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="text-[15px] leading-relaxed text-neutral-500">
                {article.subtitle}
              </p>
            )}
          </div>

          <p className="line-clamp-3 text-[14px] leading-[1.78] text-neutral-400">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={2} aria-hidden="true" />
              {article.date}
            </span>
            {article.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} strokeWidth={2} aria-hidden="true" />
                {article.location}
              </span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2} aria-hidden="true" />
                {article.readTime}
              </span>
            )}
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white">
              {article.author.initials}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-neutral-800">{article.author.name}</p>
              <p className="text-[11.5px] text-neutral-400">{article.author.role}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-2">
            <span className="group/btn inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-black hover:scale-[1.02]">
              Read story
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default FeaturedCard;
