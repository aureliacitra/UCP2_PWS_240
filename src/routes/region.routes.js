const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { getRegions, createRegion } = require('../controllers/region.controller');

router.get('/', getRegions); // publik, gak perlu API key, cuma buat lihat daftar region
router.post('/', verifyToken, createRegion); // wajib login buat nambah region baru

module.exports = router;
