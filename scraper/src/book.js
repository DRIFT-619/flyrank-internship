const cheerio = require('cheerio');
const { fetchPage } = require('./fetcher');

const RATING_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];

function slugFromUrl(url) {
  // Turns .../a-light-in-the-attic_1000/index.html into a-light-in-the-attic_1000
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 2];
}

function parseBookPage(html, bookUrl, sourcePage) {
  const $ = cheerio.load(html);

  const title = $('div.product_main h1').text().trim();

  const priceText = $('div.product_main p.price_color').text().trim();

  const availabilityText = $('div.product_main p.instock.availability')
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  const ratingClasses = $('div.product_main p.star-rating').attr('class') || '';
  const ratingWord = ratingClasses.split(' ').find((c) => RATING_WORDS.includes(c)) || null;

  const descriptionEl = $('#product_description').next('p');
  const description = descriptionEl.length ? descriptionEl.text().trim() : null;

  return {
    title,
    product_url: bookUrl,
    price_text: priceText,
    availability_text: availabilityText,
    rating_text: ratingWord,
    description,
    source_page: sourcePage,
    fetched_at: new Date().toISOString(),
  };
}

async function fetchBookRecord(bookUrl, sourcePage) {
  const cacheKey = `book-${slugFromUrl(bookUrl)}`;
  const html = await fetchPage(bookUrl, cacheKey);
  return parseBookPage(html, bookUrl, sourcePage);
}

module.exports = { fetchBookRecord, parseBookPage };