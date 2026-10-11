/**
 * fetch-featured-books.mjs
 *
 * Runs automatically before every build ("prebuild" in package.json).
 *
 * Asks the backend for the featured books and saves the fields a homepage
 * card needs into src/data/featured-books.json. The homepage imports that
 * file, so its books are part of the page itself and do not depend on the
 * backend being awake (Render's free plan puts the server to sleep when idle).
 *
 * A build can afford to wait for a cold start, so the timeout is generous.
 * This script never fails the build: if the backend cannot be reached, the
 * previous copy of the file is kept.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here   = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(here, '../src/data/featured-books.json');

const TIMEOUT_MS = 120_000; // a free Render server can take about a minute to wake

// Locally the API address comes from .env. On Vercel it comes from the
// project's environment variables. Variables that are already set win.
try {
  process.loadEnvFile(resolve(here, '../.env'));
} catch {
  // No .env file (for example on Vercel): that is fine.
}

// Only what a homepage card shows. No pdfUrl and no long description.
function pickCardFields(book) {
  return {
    _id:        book._id,
    title:      book.title,
    authors:    book.authors,
    categories: book.categories,
    coverImage: book.coverImage,
    rating:     book.rating,
    savesCount: book.savesCount,
    pages:      book.pages,
    featured:   book.featured,
  };
}

// Make sure the file exists, so importing it never breaks the build.
async function ensureOutputFile() {
  try {
    await readFile(OUTPUT, 'utf8');
  } catch {
    await mkdir(dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, '[]\n');
  }
}

async function main() {
  await ensureOutputFile();

  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('[featured-books] VITE_API_URL is not set. Keeping the existing copy.');
    return;
  }

  // The same query the homepage sends when it loads its books.
  const query = new URLSearchParams({
    featured: 'true',
    limit: '3',
    sort: '-savesCount',
  });
  const url = `${apiUrl}/api/books?${query}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log('[featured-books] Fetching featured books (a sleeping server can take a minute)...');
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Backend answered with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response: expected an array of books');
    }

    // An empty list is more likely a hiccup than reality; keep the old copy.
    if (data.length === 0) {
      console.warn('[featured-books] The backend returned no featured books. Keeping the existing copy.');
      return;
    }

    const cards = data.map(pickCardFields);
    await writeFile(OUTPUT, `${JSON.stringify(cards, null, 2)}\n`);
    console.log(`[featured-books] Saved ${cards.length} featured books to src/data/featured-books.json`);
  } catch (error) {
    const reason = error.name === 'AbortError'
      ? `no answer within ${TIMEOUT_MS / 1000} seconds`
      : error.message;
    console.warn(`[featured-books] Could not refresh (${reason}). Keeping the existing copy.`);
  } finally {
    clearTimeout(timer);
  }
}

main();