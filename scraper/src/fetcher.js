const fs = require('fs');
const path = require('path');

const USER_AGENT = 'FlyRankInternshipA5/1.0 (+https://github.com/DRIFT-619/flyrank-internship)';
const TIMEOUT_MS = 10000;
const CACHE_DIR = path.join(__dirname, '..', 'cache');

function cachePathFor(cacheKey) {
  return path.join(CACHE_DIR, `${cacheKey}.html`);
}

async function fetchPage(url, cacheKey) {
  const cachePath = cachePathFor(cacheKey);

  if (fs.existsSync(cachePath)) {
    const html = fs.readFileSync(cachePath, 'utf-8');
    console.log(`CACHE HIT  ${cacheKey}  (${html.length} bytes)`);
    return html;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status !== 200) {
    throw new Error(`Fetch failed for ${url}: status ${response.status}`);
  }

  const html = await response.text();

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, html, 'utf-8');

  console.log(`FETCH      ${cacheKey}  (${html.length} bytes)`);

  return html;
}

module.exports = { fetchPage, USER_AGENT, TIMEOUT_MS };