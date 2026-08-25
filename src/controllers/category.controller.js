const pool = require('../config/db');

async function getCategories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name wajib diisi' });

    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json({ message: 'Kategori berhasil dibuat', category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

module.exports = { getCategories, createCategory };
