const dotenv = require('dotenv');
dotenv.config();

module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    console.warn(`Unauthorized API access attempt from IP: ${req.ip}, Path: ${req.originalUrl}, Provided key: ${apiKey || 'none'}`);
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access denied. A valid API key must be provided in the x-api-key header.'
      }
    });
  }
  next();
}; 