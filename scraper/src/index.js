const { fetchPage } = require('./fetcher');

async function main() {
  const url = 'https://books.toscrape.com/catalogue/page-1.html';
  await fetchPage(url, 'catalogue-page-1');
}

main();