const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { register, login, getProfile } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
