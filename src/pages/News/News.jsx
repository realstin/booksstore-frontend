import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper } from "lucide-react";
import Container from "../../components/Container";
import { NewsCard } from "../../components/News/NewsCard";
import { FeaturedCard } from "../../components/News/FeaturedCard";
import {
  getFeaturedArticle,
  getRegularArticles,
  getAllCategories,
  getAllArticles,
} from "../../data/news";

const ease = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────
   Category filter pills
───────────────────────────────────────── */
function CategoryFilter({ categories, active, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.35, ease }}
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((cat) => (
        <motion.button
          key={cat}
          onClick={() => onChange(cat)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.16 }}
          className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
            active === cat
              ? "border-neutral-950 bg-neutral-950 text-white"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
          }`}
          aria-pressed={active === cat}
        >
          {cat}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
function EmptyState({ category }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <Newspaper size={36} className="text-neutral-300" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-[1rem] font-semibold text-neutral-700">
        {category === "All" ? "No news yet." : `No articles in "${category}" yet.`}
      </p>
      <p className="max-w-xs text-[14px] text-neutral-400">
        Something new is coming soon. Check back for updates from BookStore.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   News listing page
───────────────────────────────────────── */
function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = getAllCategories();
  const featured   = getFeaturedArticle();
  const all        = getAllArticles();

  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  /* Filter logic */
  const filtered =
    activeCategory === "All"
      ? all
      : all.filter((a) => a.category === activeCategory);

  /* When a category is active, skip the featured card separation */
  const showFeatured = activeCategory === "All" && featured;
  const gridArticles =
    activeCategory === "All"
      ? getRegularArticles()
      : filtered;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Dot-grid */}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="news-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#news-dot-grid)" />
      </svg>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-neutral-100 bg-white py-20 lg:py-28"
        aria-labelledby="news-heading"
      >
        <Container>
          <div className="mx-auto max-w-3xl">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="mb-4 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
            >
              <Newspaper size={13} strokeWidth={2.5} aria-hidden="true" />
              BookStore News
            </motion.p>

            {/* Heading */}
            <motion.h1
              id="news-heading"
              initial={{ opacity: 0, y: 22 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: 0.08, ease }}
              className="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.07] tracking-[-0.025em] text-neutral-950"
            >
              News, updates, and stories from BookStore.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.68, delay: 0.18, ease }}
              className="mb-10 max-w-xl text-[1.0625rem] leading-[1.78] text-neutral-500"
            >
              Stay up to date with the latest product updates, milestones, and
              stories from BookStore as we continue building a better way to
              discover trusted learning resources.
            </motion.p>

            {/* Category filter */}
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════
          CONTENT
      ══════════════════════════════════════ */}
      <section className="py-16 lg:py-24" aria-label="News articles">
        <Container>

          {/* Featured article */}
          {showFeatured && (
            <div className="mb-14">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
                className="mb-6 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
              >
                Featured
              </motion.p>
              <FeaturedCard article={featured} />
            </div>
          )}

          {/* Section label for the grid */}
          {showFeatured && getRegularArticles().length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="mb-8 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400"
            >
              More from BookStore
            </motion.p>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <EmptyState category={activeCategory} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(showFeatured ? gridArticles : filtered).map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}

        </Container>
      </section>
    </div>
  );
}

export default News;
