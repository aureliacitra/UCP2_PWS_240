const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const verifyApiKey = require('../middleware/apiKey.middleware');
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destination.controller');

// Endpoint BACA data — ini yang dipakai konsumen API pakai API key (x-api-key header)
router.get('/', verifyApiKey, getDestinations);
router.get('/:id', verifyApiKey, getDestinationById);

// Endpoint KELOLA data — wajib login pakai JWT (Authorization: Bearer <token>)
router.post('/', verifyToken, createDestination);
router.put('/:id', verifyToken, updateDestination);
router.delete('/:id', verifyToken, deleteDestination);

module.exports = router;
