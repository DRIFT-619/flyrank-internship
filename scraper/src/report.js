const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

function writeRunReport(stats) {
  const report = {
    started_at: stats.startedAt,
    finished_at: new Date().toISOString(),
    duration_ms: Date.now() - new Date(stats.startedAt).getTime(),
    pages_fetched: stats.pagesFetched,
    cache_hits: stats.cacheHits,
    valid_records: stats.validRecords,
    invalid_records: stats.invalidRecords,
    failed_pages: stats.failedPages,
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'run-report.json'),
    JSON.stringify(report, null, 2)
  );

  return report;
}

module.exports = { writeRunReport };