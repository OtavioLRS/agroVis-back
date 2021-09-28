const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Token invalid' });

    req.id = decoded.id;
    return next();
  })

};