const { discoverBookUrls } = require('./catalogue');
const { fetchBookRecord } = require('./book');

const DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const books = await discoverBookUrls();

  const records = [];

  for (const { url, sourcePage } of books) {
    const record = await fetchBookRecord(url, sourcePage);
    records.push(record);
    await sleep(DELAY_MS);
  }

  console.log(`detail_pages=${records.length}`);
  console.log('Sample record:', JSON.stringify(records[0], null, 2));
}

main();