const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { getCategories, createCategory } = require('../controllers/category.controller');

router.get('/', getCategories); // publik, gak perlu API key, cuma buat lihat daftar kategori
router.post('/', verifyToken, createCategory); // wajib login buat nambah kategori baru

module.exports = router;
