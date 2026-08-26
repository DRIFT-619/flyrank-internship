const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('../openapi.json');

const metaRoutes = require('./routes/meta.routes');
const tasksRoutes = require('./routes/tasks.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler } = require('./middleware/error-handler');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  app.use('/', metaRoutes);
  app.use('/', tasksRoutes);
  app.use('/', authRoutes);

  // Must be last — Express only reaches this when something calls next(err).
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };