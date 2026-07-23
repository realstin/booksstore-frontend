/**
 * BookStore News Data
 *
 * HOW TO ADD A NEW ARTICLE:
 * 1. Copy an existing object below
 * 2. Change the id, slug, title, and content
 * 3. Set featured: true on at most ONE article
 * 4. Save — the News listing and article pages update automatically
 */

export const newsArticles = [
  {
    id: "introducing-bookstore",
    slug: "introducing-bookstore",
    title: "Introducing BookStore: A New Way to Discover Trusted Technology Books",
    subtitle:
      "We are building a platform designed to help learners discover carefully selected, up-to-date books without wasting hours searching the web.",
    excerpt:
      "BookStore is live. We built it to solve a problem every developer knows: finding trustworthy, current learning resources takes too long. Here is why we built it and what comes next.",
    date: "July 20, 2026",
    location: "Kigali, Rwanda",
    category: "Product",
    coverImage: null,
    readTime: "4 min read",
    author: {
      name: "IRATUZI M. Justin",
      role: "Founder & Full Stack Developer",
      initials: "IJ",
    },
    featured: true,
    event: null,
    content: [
      {
        type: "paragraph",
        content:
          "Every developer has felt the frustration. You want to learn something new — maybe Kubernetes, maybe machine learning, maybe system design — and you spend the first hour just trying to figure out which book is worth reading. Links are outdated. Reviews are scattered across Reddit threads. Some editions are years behind the current technology.",
      },
      {
        type: "paragraph",
        content:
          "BookStore exists to solve exactly that. We curate, organize, and verify technology books so that learners can skip the searching and go straight to learning. Every book in our library has been reviewed for quality, relevance, and accuracy. We keep the collection up to date as technologies evolve.",
      },
      {
        type: "heading",
        content: "What we built",
      },
      {
        type: "paragraph",
        content:
          "Version one of BookStore is focused entirely on books. Not courses, not videos, not podcasts — just books. We believe books are still one of the most effective ways to build deep, lasting knowledge. A well-written book gives you context, reasoning, and depth that a quick tutorial often cannot.",
      },
      {
        type: "paragraph",
        content:
          "The platform is designed to feel calm and focused. No advertisements. No cluttered interfaces. No dark patterns. Just a clean, organized library of trusted resources.",
      },
      {
        type: "heading",
        content: "The reading experience",
      },
      {
        type: "paragraph",
        content:
          "We spent a significant amount of time designing the reading experience. The interface is built for long reading sessions — comfortable typography, generous spacing, distraction-free layouts, and reading progress tracking so you always know where you left off.",
      },
      {
        type: "paragraph",
        content:
          "You can save books to your personal library, mark favorites, download for offline reading, and organize your collection the way that works best for you.",
      },
      {
        type: "heading",
        content: "What is coming next",
      },
      {
        type: "paragraph",
        content:
          "This is version one. We have a lot more planned. Personal reading dashboards, community recommendations, smarter discovery tools, and expert-curated collections are all on the roadmap. We will keep you updated right here as we ship each one.",
      },
      {
        type: "paragraph",
        content:
          "If you have feedback, suggestions, or just want to say hello, reach out through the Contact page. We read every message.",
      },
    ],
  },
  {
    id: "why-we-started",
    slug: "why-we-started",
    title: "Why We Started BookStore",
    subtitle: "The story behind the platform and the problem we set out to solve.",
    excerpt:
      "The idea for BookStore came from a simple, recurring frustration. Here is the story of how it started and where it is going.",
    date: "July 18, 2026",
    location: "Kigali, Rwanda",
    category: "Company",
    coverImage: null,
    readTime: "3 min read",
    author: {
      name: "IRATUZI M. Justin",
      role: "Founder & Full Stack Developer",
      initials: "IJ",
    },
    featured: false,
    event: null,
    content: [
      {
        type: "paragraph",
        content:
          "The idea for BookStore came from a simple, recurring frustration. Every time I wanted to learn something new, I found myself spending more time searching for good resources than actually learning. The best books were buried under dozens of low-quality recommendations, outdated editions, and broken links.",
      },
      {
        type: "paragraph",
        content:
          "I started keeping a personal list of books I trusted — books that were well-written, technically accurate, and up to date. Over time, that list grew. Friends started asking for recommendations. It became clear that the problem was not mine alone.",
      },
      {
        type: "heading",
        content: "A gap worth filling",
      },
      {
        type: "paragraph",
        content:
          "There is no shortage of content on the internet. The problem is trust and organization. Anyone can publish anything. Telling the difference between a reliable resource and a mediocre one requires experience and time — two things that learners, especially beginners, often do not have.",
      },
      {
        type: "paragraph",
        content:
          "BookStore is our answer to that problem. A carefully maintained library where every book earns its place. We do the curation work so that learners can focus entirely on learning.",
      },
      {
        type: "heading",
        content: "Built in Kigali",
      },
      {
        type: "paragraph",
        content:
          "BookStore was designed and built in Kigali, Rwanda. The technology community here is young, growing fast, and hungry for quality learning resources. We built this platform with that community in mind, but we designed it for learners everywhere.",
      },
    ],
  },
  {
    id: "bookstore-design-principles",
    slug: "bookstore-design-principles",
    title: "The Design Principles Behind BookStore",
    subtitle: "How we think about design, and why every decision starts with the learner.",
    excerpt:
      "Great design is invisible. Here are the principles we used to shape every corner of the BookStore experience.",
    date: "July 15, 2026",
    location: "Kigali, Rwanda",
    category: "Engineering",
    coverImage: null,
    readTime: "5 min read",
    author: {
      name: "IRATUZI M. Justin",
      role: "Founder & Full Stack Developer",
      initials: "IJ",
    },
    featured: false,
    event: null,
    content: [
      {
        type: "paragraph",
        content:
          "When we started designing BookStore, we made one decision early on that shaped everything else: the learner comes first. Not the business model, not the feature roadmap — the person sitting down to read and learn.",
      },
      {
        type: "heading",
        content: "Calm over stimulating",
      },
      {
        type: "paragraph",
        content:
          "Most digital products are designed to maximize engagement. More clicks, more time on site, more notifications. We deliberately went the other way. BookStore is designed to be calm. The interface should fade into the background so the content can come forward.",
      },
      {
        type: "paragraph",
        content:
          "That means no advertisements, no autoplay, no push notifications, no gamification mechanics that turn learning into a numbers game. Just a clean, focused environment where reading is easy.",
      },
      {
        type: "heading",
        content: "Whitespace as a design tool",
      },
      {
        type: "paragraph",
        content:
          "We use a lot of whitespace. This is a deliberate choice. Generous spacing reduces cognitive load, makes text easier to read, and gives the design a premium, editorial feel. Every element on the page has room to breathe.",
      },
      {
        type: "heading",
        content: "Typography matters",
      },
      {
        type: "paragraph",
        content:
          "We spent more time on typography than on almost any other design decision. The right typeface, the right size, the right line height — these details have an enormous impact on how comfortable it is to read for long periods. We tested many options before settling on our current choices.",
      },
      {
        type: "paragraph",
        content:
          "Good typography is largely invisible. You do not notice it when it is right. You only notice it when it is wrong — when the lines are too long, the spacing too tight, the contrast too low. We worked hard to get it right.",
      },
      {
        type: "heading",
        content: "Consistent, not repetitive",
      },
      {
        type: "paragraph",
        content:
          "Consistency means that once you learn how one part of the interface works, every other part works the same way. It reduces the learning curve and makes the product feel reliable and trustworthy. But consistency should never become repetitive — every section of the product should feel purposeful, not like a copy of the one before it.",
      },
    ],
  },
  {
    id: "community-launch",
    slug: "community-launch",
    title: "Building the BookStore Community",
    subtitle: "How readers and learners are shaping the future of BookStore together.",
    excerpt:
      "The best book recommendations come from people who have actually read the books. Here is how we are building a community around that idea.",
    date: "July 10, 2026",
    location: "Kigali, Rwanda",
    category: "Community",
    coverImage: null,
    readTime: "3 min read",
    author: {
      name: "IRATUZI M. Justin",
      role: "Founder & Full Stack Developer",
      initials: "IJ",
    },
    featured: false,
    event: null,
    content: [
      {
        type: "paragraph",
        content:
          "The best book recommendation you will ever get is from someone who has actually read the book and found it genuinely useful. Not a publisher's marketing copy. Not an algorithm's prediction. A real reader's honest opinion.",
      },
      {
        type: "paragraph",
        content:
          "That insight shapes how we think about community at BookStore. We are not trying to build a social network. We are trying to surface the collective wisdom of a community of learners — people who have read these books, applied the knowledge, and can speak honestly about what was valuable and what was not.",
      },
      {
        type: "heading",
        content: "Community favorites",
      },
      {
        type: "paragraph",
        content:
          "The Community Favorites section of BookStore is powered by real reader behavior — books that people actually save, return to, and recommend. These are not paid placements or editorial picks. They are a direct reflection of what the community finds valuable.",
      },
      {
        type: "paragraph",
        content:
          "As the community grows, these signals get stronger and more reliable. A book with thousands of saves and high ratings from real readers is a much stronger signal than any marketing copy.",
      },
      {
        type: "heading",
        content: "Growing together",
      },
      {
        type: "paragraph",
        content:
          "We are at the very beginning of building this community. If you are reading this, you are part of the first wave. Your behavior on the platform — the books you save, the ones you mark as favorites, the libraries you build — is helping shape the experience for everyone who comes after you.",
      },
      {
        type: "paragraph",
        content:
          "We are grateful for that. And we are committed to building a community experience that is worthy of your trust.",
      },
    ],
  },
];

/** Returns all articles sorted by date descending */
export function getAllArticles() {
  return [...newsArticles];
}

/** Returns the single featured article, or null */
export function getFeaturedArticle() {
  return newsArticles.find((a) => a.featured) ?? null;
}

/** Returns all non-featured articles */
export function getRegularArticles() {
  return newsArticles.filter((a) => !a.featured);
}

/** Finds an article by slug */
export function getArticleBySlug(slug) {
  return newsArticles.find((a) => a.slug === slug) ?? null;
}

/** Returns related articles (same category, excluding current) */
export function getRelatedArticles(currentSlug, limit = 3) {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];
  const sameCategory = newsArticles.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = newsArticles.filter(
    (a) => a.slug !== currentSlug && a.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** All unique categories from the data */
export function getAllCategories() {
  const cats = newsArticles.map((a) => a.category);
  return ["All", ...Array.from(new Set(cats))];
}
