const cheerio = require('cheerio');
const { fetchPage } = require('./fetcher');

const BASE_CATALOGUE_URL = 'https://books.toscrape.com/catalogue/page-1.html';
const DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Extracts every book link on one catalogue page, plus the "next" page URL
// if one exists. Both are converted to absolute URLs using the page's own
// URL as the base — never by gluing strings together.
function parseCataloguePage(html, pageUrl) {
  const $ = cheerio.load(html);

  const bookLinks = [];
  $('article.product_pod h3 a').each((i, el) => {
    const href = $(el).attr('href');
    const absoluteUrl = new URL(href, pageUrl).toString();
    bookLinks.push(absoluteUrl);
  });

  const nextHref = $('li.next a').attr('href');
  const nextPageUrl = nextHref ? new URL(nextHref, pageUrl).toString() : null;

  return { bookLinks, nextPageUrl };
}

async function discoverBookUrls() {
  const allBooks = [];
  let currentUrl = BASE_CATALOGUE_URL;
  let pageNumber = 1;

  while (currentUrl && pageNumber <= 3) {
    const cacheKey = `catalogue-page-${pageNumber}`;
    const wasCached = require('fs').existsSync(
      require('path').join(__dirname, '..', 'cache', `${cacheKey}.html`)
    );

    const html = await fetchPage(currentUrl, cacheKey);

    if (!wasCached) {
      await sleep(DELAY_MS);
    }

    const { bookLinks, nextPageUrl } = parseCataloguePage(html, currentUrl);

    for (const url of bookLinks) {
      allBooks.push({ url, sourcePage: currentUrl });
    }

    currentUrl = nextPageUrl;
    pageNumber += 1;
  }

  const seen = new Set();
  const uniqueBooks = allBooks.filter((book) => {
    if (seen.has(book.url)) return false;
    seen.add(book.url);
    return true;
  });

  console.log(`catalogue_pages=${pageNumber - 1}`);
  console.log(`discovered=${allBooks.length}`);
  console.log(`unique_urls=${uniqueBooks.length}`);

  return uniqueBooks;
}

module.exports = { discoverBookUrls, parseCataloguePage };