const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw next(new AuthError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
