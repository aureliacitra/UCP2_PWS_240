const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const apiKeyRoutes = require('./routes/apiKey.routes');
const destinationRoutes = require('./routes/destination.routes');
const categoryRoutes = require('./routes/category.routes');
const regionRoutes = require('./routes/region.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/destinations', destinationRoutes);
app.use('/categories', categoryRoutes);
app.use('/regions', regionRoutes);

// Endpoint buat cek server + koneksi database jalan atau tidak
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Wisata API jalan',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal konek ke database', error: err.message });
  }
});

// Route-route lain akan ditambah di sini nanti (auth, destinations, dll)

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
}

module.exports = app; // di-export biar bisa dipakai Vercel serverless function
