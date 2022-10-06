const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const AuthError = require('../errors/AuthError');

module.exports.getUserInfo = async (req, res, next) => {
  const { email, name } = req.body;
  const id = req.user._id;

  try {
    const user = await User.findById(
      id,
      { email, name },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }

    return next(new ServerError());
  }
};

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new ServerError());
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthError('Неправильные почта или пароль'));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(new AuthError('Неправильные почта или пароль'));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send({ token });
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};
