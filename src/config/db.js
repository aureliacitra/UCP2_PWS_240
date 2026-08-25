const { Pool } = require('pg');
require('dotenv').config();

// Pool dipakai (bukan single Client) karena lebih tahan buat serverless (Vercel)
// tiap request bisa pinjam koneksi dari pool ini
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // wajib buat konek ke Supabase
});

pool.on('error', (err) => {
  console.error('Unexpected error pada koneksi database', err);
});

module.exports = pool;
