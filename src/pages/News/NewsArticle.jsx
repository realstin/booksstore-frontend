import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, ArrowRight, Newspaper } from "lucide-react";
import Container from "../../components/Container";
import { AuthorCard } from "../../components/News/AuthorCard";
import { NewsCard } from "../../components/News/NewsCard";
import { getArticleBySlug, getRelatedArticles } from "../../data/news";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

/* ─────────────────────────────────────────
   404 state
───────────────────────────────────────── */
function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
         style={{ fontFamily: "var(--font-sans)" }}>
      <Newspaper size={44} className="text-neutral-300" strokeWidth={1.25} aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.5rem] font-bold tracking-tight text-neutral-950">
          News story not found.
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-neutral-500">
          The story you&apos;re looking for may have been moved or doesn&apos;t exist.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/news"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-6 text-[14px] font-semibold text-white transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to News
        </Link>
        <Link
          to="/homepage"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 text-[14px] font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Image with caption
───────────────────────────────────────── */
function ArticleImage({ src, alt, caption }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="my-8"
    >
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        className="w-full rounded-2xl border border-neutral-200 object-cover"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-[12.5px] text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ─────────────────────────────────────────
   Renders a single content block
───────────────────────────────────────── */
function ContentBlock({ block, index }) {
  if (block.type === "paragraph") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.55, delay: index * 0.04, ease }}
        className="text-[16px] leading-[1.85] text-neutral-600"
      >
        {block.content}
      </motion.p>
    );
  }

  if (block.type === "heading") {
    return (
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.55, delay: index * 0.04, ease }}
        className="mt-2 text-[1.25rem] font-bold tracking-tight text-neutral-950"
      >
        {block.content}
      </motion.h2>
    );
  }

  if (block.type === "image") {
    return (
      <ArticleImage src={block.src} alt={block.alt} caption={block.caption} />
    );
  }

  if (block.type === "quote") {
    return (
      <motion.blockquote
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.55, ease }}
        className="border-l-2 border-neutral-900 pl-5 text-[1.05rem] font-medium italic leading-relaxed text-neutral-700"
      >
        {block.content}
      </motion.blockquote>
    );
  }

  return null;
}

/* ─────────────────────────────────────────
   NewsArticle page
───────────────────────────────────────── */
function NewsArticle() {
  const { slug } = useParams();
  const article  = getArticleBySlug(slug);

  if (!article) return <NotFound />;

  const related = getRelatedArticles(slug, 3);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Dot-grid */}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="article-dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0f1419" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#article-dot-grid)" />
      </svg>

      <div className="relative">
        <Container>

          {/* ── Back navigation ── */}
          <div className="pt-10 pb-8">
            <motion.div {...fadeUp(0)}>
              <Link
                to="/news"
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-neutral-600 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                Back to News
              </Link>
            </motion.div>
          </div>

          {/* ── Article header ── */}
          <header className="mx-auto max-w-2xl pb-10 lg:pb-14">

            {/* Category */}
            <motion.span
              {...fadeUp(0.06)}
              className="mb-4 inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
            >
              {article.category}
            </motion.span>

            {/* Title */}
            <motion.h1
              {...fadeUp(0.12)}
              className="mb-4 text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.07] tracking-tight text-neutral-950"
            >
              {article.title}
            </motion.h1>

            {/* Subtitle */}
            {article.subtitle && (
              <motion.p
                {...fadeUp(0.18)}
                className="mb-6 text-[1.0625rem] leading-[1.7] text-neutral-500"
              >
                {article.subtitle}
              </motion.p>
            )}

            {/* Meta */}
            <motion.div
              {...fadeUp(0.24)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-b border-neutral-100 py-4 text-[13px] text-neutral-400"
            >
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
            </motion.div>

          </header>

          {/* ── Cover image ── */}
          {article.coverImage && (
            <motion.div
              {...fadeUp(0.28)}
              className="mx-auto mb-12 max-w-3xl overflow-hidden rounded-3xl border border-neutral-200"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                loading="lazy"
                className="w-full object-cover"
              />
            </motion.div>
          )}

          {/* ── Article body ── */}
          <article
            className="mx-auto max-w-2xl"
            aria-label={article.title}
          >
            <div className="flex flex-col gap-6">
              {article.content.map((block, i) => (
                <ContentBlock key={i} block={block} index={i} />
              ))}
            </div>

            {/* ── Author ── */}
            <div className="mt-12">
              <AuthorCard author={article.author} />
            </div>

            {/* ── Bottom navigation ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease }}
              className="mt-10 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-8"
            >
              <Link
                to="/news"
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-[13.5px] font-semibold text-neutral-700 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                All News
              </Link>
              <Link
                to="/homepage"
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Back to Home
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </article>

          {/* ── Related articles ── */}
          {related.length > 0 && (
            <section
              className="mx-auto mt-20 max-w-5xl pb-20 lg:pb-28"
              aria-labelledby="related-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease }}
                className="mb-8"
              >
                <p className="mb-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Keep reading
                </p>
                <h2
                  id="related-heading"
                  className="text-[1.3rem] font-bold tracking-tight text-neutral-950"
                >
                  More from BookStore
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((a, i) => (
                  <NewsCard key={a.id} article={a} index={i} />
                ))}
              </div>
            </section>
          )}

        </Container>
      </div>
    </div>
  );
}

export default NewsArticle;
