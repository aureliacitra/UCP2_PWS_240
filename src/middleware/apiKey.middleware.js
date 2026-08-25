const pool = require('../config/db');

// Middleware ini dipakai di endpoint DATA (misal /destinations) yang diakses
// pakai API key, BUKAN pakai JWT. Cara pakai: taruh sebagai parameter kedua
// di route, contoh: router.get('/destinations', verifyApiKey, getDestinations);
//
// Konsumen API wajib kirim header: x-api-key: <key>
async function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key tidak ditemukan. Kirim lewat header x-api-key' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM api_keys WHERE key = $1 AND is_active = true',
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'API key tidak valid atau sudah nonaktif' });
    }

    req.apiKeyOwner = result.rows[0].user_id; // opsional, siapa tau kepake nanti
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

module.exports = verifyApiKey;
