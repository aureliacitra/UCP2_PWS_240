// Vercel mendeteksi file di folder /api sebagai serverless function.
// File ini tinggal re-export app Express yang udah dibuat di src/server.js
module.exports = require('../src/server');
