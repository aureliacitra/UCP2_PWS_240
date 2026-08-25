const pool = require('../config/db');

// GET /destinations — diakses konsumen API pakai API key
// Support filter opsional: ?category_id=1&region_id=2, dan pagination ?page=1&limit=20
async function getDestinations(req, res) {
  try {
    const { category_id, region_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT d.*, c.name AS category_name, r.name AS region_name, r.island
      FROM destinations d
      LEFT JOIN categories c ON d.category_id = c.id
      LEFT JOIN regions r ON d.region_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      params.push(category_id);
      query += ` AND d.category_id = $${params.length}`;
    }
    if (region_id) {
      params.push(region_id);
      query += ` AND d.region_id = $${params.length}`;
    }

    query += ` ORDER BY d.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM destinations');

    res.json({
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      destinations: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

// GET /destinations/:id — diakses konsumen API pakai API key
async function getDestinationById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT d.*, c.name AS category_name, r.name AS region_name, r.island
       FROM destinations d
       LEFT JOIN categories c ON d.category_id = c.id
       LEFT JOIN regions r ON d.region_id = r.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    }

    res.json({ destination: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

// POST /destinations — wajib login (admin), pakai JWT
async function createDestination(req, res) {
  try {
    const { name, description, category_id, region_id, city, rating, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name wajib diisi' });
    }

    const result = await pool.query(
      `INSERT INTO destinations (name, description, category_id, region_id, city, rating, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description || null, category_id || null, region_id || null, city || null, rating || null, image_url || null]
    );

    res.status(201).json({ message: 'Destinasi berhasil dibuat', destination: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

// PUT /destinations/:id — wajib login (admin), pakai JWT
async function updateDestination(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category_id, region_id, city, rating, image_url } = req.body;

    const existing = await pool.query('SELECT id FROM destinations WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    }

    const result = await pool.query(
      `UPDATE destinations
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           region_id = COALESCE($4, region_id),
           city = COALESCE($5, city),
           rating = COALESCE($6, rating),
           image_url = COALESCE($7, image_url)
       WHERE id = $8 RETURNING *`,
      [name, description, category_id, region_id, city, rating, image_url, id]
    );

    res.json({ message: 'Destinasi berhasil diupdate', destination: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

// DELETE /destinations/:id — wajib login (admin), pakai JWT
async function deleteDestination(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    }

    res.json({ message: 'Destinasi berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
}

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
