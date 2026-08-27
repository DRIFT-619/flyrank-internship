const fs = require('fs');
const path = require('path');
const { BookRecordSchema } = require('./schema');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function validateAndStore(normalizedRecords) {
  const validRecords = [];
  const invalidRecords = [];

  // Use the canonical product_url to guarantee no duplicate books ever
  // land in the output, even if something upstream produced one twice.
  const seenUrls = new Set();

  for (const record of normalizedRecords) {
    const result = BookRecordSchema.safeParse(record);

    if (!result.success) {
      invalidRecords.push({
        record,
        reason: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
      });
      continue;
    }

    if (seenUrls.has(result.data.product_url)) {
      continue; // already have this book, from an earlier duplicate link
    }
    seenUrls.add(result.data.product_url);

    validRecords.push(result.data);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'books.json'),
    JSON.stringify(validRecords, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'errors.json'),
    JSON.stringify(invalidRecords, null, 2)
  );

  return { validRecords, invalidRecords };
}

module.exports = { validateAndStore };