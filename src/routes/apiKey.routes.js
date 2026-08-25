const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { generateApiKey, listApiKeys } = require('../controllers/apiKey.controller');

// Semua route di sini wajib login dulu (pakai JWT), makanya ada verifyToken
router.post('/', verifyToken, generateApiKey);
router.get('/', verifyToken, listApiKeys);

module.exports = router;
