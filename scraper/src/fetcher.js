const fs = require('fs');
const path = require('path');

const USER_AGENT = 'FlyRankInternshipA5/1.0 (+https://github.com/DRIFT-619/flyrank-internship)';
const TIMEOUT_MS = 10000;
const CACHE_DIR = path.join(__dirname, '..', 'cache');

function cachePathFor(cacheKey) {
  return path.join(CACHE_DIR, `${cacheKey}.html`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rawFetch(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Wraps a single fetch with the doc's retry rule: retry once on a timeout
// or a 5xx server error (the server might just be having a bad moment).
// Never retry a 404 (the page doesn't exist) or a 403 (the site said no) —
// asking again changes nothing and a 403 retry is how a polite robot
// becomes a pest.
async function fetchWithRetry(url) {
  try {
    const response = await rawFetch(url);

    if (response.status >= 500) {
      throw new Error(`Server error ${response.status}`);
    }

    return response;
  } catch (err) {
    console.log(`RETRY      ${url}  (${err.message})`);
    await sleep(1000);
    return rawFetch(url);
  }
}

async function fetchPage(url, cacheKey) {
  const cachePath = cachePathFor(cacheKey);

  if (fs.existsSync(cachePath)) {
    const html = fs.readFileSync(cachePath, 'utf-8');
    console.log(`CACHE HIT  ${cacheKey}  (${html.length} bytes)`);
    return { html, wasCached: true };
  }

  const response = await fetchWithRetry(url);

  if (response.status === 404 || response.status === 403) {
    throw new Error(`Fetch failed for ${url}: status ${response.status} (not retrying)`);
  }

  if (response.status !== 200) {
    throw new Error(`Fetch failed for ${url}: status ${response.status}`);
  }

  const html = await response.text();

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, html, 'utf-8');

  console.log(`FETCH      ${cacheKey}  (${html.length} bytes)`);

  return { html, wasCached: false };
}

module.exports = { fetchPage, USER_AGENT, TIMEOUT_MS };