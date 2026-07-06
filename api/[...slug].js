const app = require('../server/server.js');

module.exports = (req, res) => {
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url === '/' ? '' : req.url}`;
  }
  return app(req, res);
};
