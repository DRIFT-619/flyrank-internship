// Turns raw scraped strings into clean, typed values. The raw text is kept
// too (see schema.js) — the raw and clean values live side by side.

function parsePriceGbp(priceText) {
  // "£51.77" -> 51.77
  const numeric = priceText.replace(/[^0-9.]/g, '');
  const value = parseFloat(numeric);
  return Number.isNaN(value) ? null : value;
}

function normalizeRecord(raw) {
  return {
    ...raw,
    price_gbp: parsePriceGbp(raw.price_text),
  };
}

module.exports = { normalizeRecord, parsePriceGbp };