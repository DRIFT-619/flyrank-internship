const { createApp } = require('./app');
const { ready } = require('./repositories/tasks.repository');

const PORT = 3000;

async function main() {
  // Wait for the database table + seed to finish before accepting requests.
  await ready;

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main();