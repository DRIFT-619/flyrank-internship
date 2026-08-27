const { discoverBookUrls } = require('./catalogue');
const { fetchBookRecord } = require('./book');
const { normalizeRecord } = require('./normalize');
const { validateAndStore } = require('./store');

const DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const books = await discoverBookUrls();

  const rawRecords = [];

  for (const { url, sourcePage } of books) {
    const record = await fetchBookRecord(url, sourcePage);
    rawRecords.push(record);
    await sleep(DELAY_MS);
  }

  console.log(`detail_pages=${rawRecords.length}`);

  const normalizedRecords = rawRecords.map(normalizeRecord);
  const { validRecords, invalidRecords } = validateAndStore(normalizedRecords);

  console.log(`valid_records=${validRecords.length}`);
  console.log(`invalid_records=${invalidRecords.length}`);
}

main();