const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
  // Vérifier si l'en-tête Authorization existe
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token manquant, accès refusé' });
  }

  // Enlever le préfixe "Bearer " de l'en-tête si nécessaire
  const bearerToken = token.split(' ')[1]; // Par exemple, "Bearer <token>"

  // Vérifier et décoder le token
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    // Ajouter les informations décodées du token à la requête
    req.user = decoded;
    next(); // Passer au prochain middleware ou à la route
  });
};

module.exports = verifyToken;
