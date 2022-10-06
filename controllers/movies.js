const Movie = require('../models/movie');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.deleteMovieById = async (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError('Такого фильма нет'));
    }
    if (movie.owner.toString() !== owner) {
      return next(new ForbiddenError('Нет прав на удаление данного фильма'));
    }
    await movie.remove();
    return res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректные данные запроса'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.createMovie = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movie = await Movie.create({
      owner, ...req.body,
    });
    return res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные карточки'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.getAllSaveMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    return res.status(200).send(movie);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};
