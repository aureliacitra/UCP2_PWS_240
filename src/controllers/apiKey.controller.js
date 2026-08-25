const crypto = require('crypto');
const pool = require('../config/db');

// POST /api-keys — wajib login (pakai middleware verifyToken di route-nya)
async function generateApiKey(req, res) {
  try {
    const userId = req.user.id; // didapat dari token JWT yang udah diverifikasi middleware

    // generate random string 32 karakter sebagai API key
    const apiKey = crypto.randomBytes(24).toString('hex');

    const result = await pool.query(
      'INSERT INTO api_keys (user_id, key, is_active) VALUES ($1, $2, true) RETURNING id, key, is_active, created_at',
      [userId, apiKey]
    );

    res.status(201).json({
      message: 'API key berhasil dibuat',
      api_key: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

// GET /api-keys — lihat semua API key milik user yang login
async function listApiKeys(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, key, is_active, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ api_keys: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

module.exports = { generateApiKey, listApiKeys };
