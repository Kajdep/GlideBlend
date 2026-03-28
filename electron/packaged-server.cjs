const express = require('express');
const path = require('path');

function addIsolationHeaders(req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
}

async function startPackagedServer() {
  const app = express();
  const distPath = path.join(__dirname, '..', 'dist');

  app.use(addIsolationHeaders);
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1');
    server.once('listening', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to resolve packaged server address.'));
        return;
      }

      resolve({
        server,
        url: `http://127.0.0.1:${address.port}`,
      });
    });
    server.once('error', reject);
  });
}

module.exports = {
  startPackagedServer,
};
