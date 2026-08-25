const pool = require('../config/db');

async function getRegions(req, res) {
  try {
    const result = await pool.query('SELECT * FROM regions ORDER BY id');
    res.json({ regions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

async function createRegion(req, res) {
  try {
    const { name, island } = req.body;
    if (!name) return res.status(400).json({ message: 'name wajib diisi' });

    const result = await pool.query(
      'INSERT INTO regions (name, island) VALUES ($1, $2) RETURNING *',
      [name, island || null]
    );
    res.status(201).json({ message: 'Region berhasil dibuat', region: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

module.exports = { getRegions, createRegion };
