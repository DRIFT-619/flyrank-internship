const { discoverBookUrls } = require('./catalogue');

async function main() {
  const urls = await discoverBookUrls();
  console.log('First 3 URLs:', urls.slice(0, 3));
}

main();