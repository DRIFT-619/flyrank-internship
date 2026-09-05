const express = require('express');
const { serve } = require('inngest/express');
const { inngest } = require('./inngest/client');
const { sayHello } = require('./inngest/functions');

const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/inngest', express.json(), serve({ client: inngest, functions: [sayHello] }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});