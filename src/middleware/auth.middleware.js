const jwt = require('jsonwebtoken');

// Middleware ini dipakai di endpoint yang WAJIB login (misal: generate API key)
// Cara pakainya: tinggal taruh sebagai parameter kedua di route, contoh:
// router.post('/api-keys', verifyToken, generateApiKey);
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login dulu' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email } dari token, bisa dipakai di controller berikutnya
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
  }
}

module.exports = verifyToken;
