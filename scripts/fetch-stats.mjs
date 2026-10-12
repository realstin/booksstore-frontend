/**
 * fetch-stats.mjs
 *
 * Runs automatically before every build ("prebuild" in package.json), right
 * after fetch-featured-books.mjs.
 *
 * Asks the backend for the homepage statistics and saves them to
 * src/data/stats-snapshot.json. The Statistics section starts from that
 * file, so the real numbers are part of the page itself and do not depend on
 * the backend being awake (Render's free plan puts the server to sleep when
 * idle).
 *
 * This script never fails the build: if the backend cannot be reached or
 * answers with something unexpected, the previous copy of the file is kept.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here   = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(here, '../src/data/stats-snapshot.json');

const TIMEOUT_MS = 120_000; // a free Render server can take about a minute to wake

// Locally the API address comes from .env. On Vercel it comes from the
// project's environment variables. Variables that are already set win.
try {
  process.loadEnvFile(resolve(here, '../.env'));
} catch {
  // No .env file (for example on Vercel): that is fine.
}

// The four numbers the Statistics section displays.
const FIELDS = ['totalBooks', 'totalUsers', 'totalSavedBooks', 'averageRating'];

function isValidStats(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    FIELDS.every((field) => Number.isFinite(data[field]))
  );
}

// Keep only the fields we use, so nothing unexpected ends up in the bundle.
function pickFields(data) {
  return Object.fromEntries(FIELDS.map((field) => [field, data[field]]));
}

// Make sure the file exists, so importing it never breaks the build.
async function ensureOutputFile() {
  try {
    await readFile(OUTPUT, 'utf8');
  } catch {
    await mkdir(dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, '{}\n');
  }
}

async function main() {
  await ensureOutputFile();

  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('[stats] VITE_API_URL is not set. Keeping the existing copy.');
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log('[stats] Fetching statistics...');
    const response = await fetch(`${apiUrl}/api/stats`, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Backend answered with status ${response.status}`);
    }

    const data = await response.json();
    if (!isValidStats(data)) {
      throw new Error('Unexpected response: one of the expected numbers is missing');
    }

    await writeFile(OUTPUT, `${JSON.stringify(pickFields(data), null, 2)}\n`);
    console.log('[stats] Saved statistics to src/data/stats-snapshot.json');
  } catch (error) {
    const reason = error.name === 'AbortError'
      ? `no answer within ${TIMEOUT_MS / 1000} seconds`
      : error.message;
    console.warn(`[stats] Could not refresh (${reason}). Keeping the existing copy.`);
  } finally {
    clearTimeout(timer);
  }
}

main();