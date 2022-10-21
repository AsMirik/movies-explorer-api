const { celebrate, Joi, CelebrateError } = require('celebrate');

const isURL = require('validator/lib/isURL');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError(`${value} 'Не является URL адресом'`);
  }
  return value;
};

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1),
    director: Joi.string().required().min(1),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(1),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    image: Joi.string().required().custom(urlValidator),
    trailerLink: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateUpdateUser,
  validateCreateMovie,
  validateDeleteMovie,
  validateLogin,
  validateSignup,
};
