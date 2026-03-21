const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    service: 'web',
    hostname: os.hostname(),
    environment: process.env.NODE_ENV || 'unknown',
    connections: {
      database: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      redis: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    hostname: os.hostname()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Web service listening on port ${PORT}`);
  console.log(`DB: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});
