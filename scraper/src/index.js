const { discoverBookUrls } = require('./catalogue');
const { fetchBookRecord } = require('./book');
const { normalizeRecord } = require('./normalize');
const { validateAndStore } = require('./store');
const { writeRunReport } = require('./report');

const DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const startedAt = new Date().toISOString();

  const books = await discoverBookUrls();

  const rawRecords = [];
  let cacheHits = 0;
  let failedPages = 0;

  for (const { url, sourcePage } of books) {
    try {
      const record = await fetchBookRecord(url, sourcePage);
      if (record.wasCached) cacheHits += 1;
      const { wasCached, ...cleanRecord } = record;
      rawRecords.push(cleanRecord);
    } catch (err) {
      console.log(`SKIP       ${url}  (${err.message})`);
      failedPages += 1;
    }
    await sleep(DELAY_MS);
  }

  console.log(`detail_pages=${rawRecords.length}`);
  console.log(`failed_pages=${failedPages}`);

  const normalizedRecords = rawRecords.map(normalizeRecord);
  const { validRecords, invalidRecords } = validateAndStore(normalizedRecords);

  console.log(`valid_records=${validRecords.length}`);
  console.log(`invalid_records=${invalidRecords.length}`);

  const report = writeRunReport({
    startedAt,
    pagesFetched: books.length,
    cacheHits,
    validRecords: validRecords.length,
    invalidRecords: invalidRecords.length,
    failedPages,
  });

  console.log('Run report:', JSON.stringify(report, null, 2));
}

main();