const router = require('express').Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validations');

const { getAllSaveMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/', getAllSaveMovies);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:id', validateDeleteMovie, deleteMovieById);

module.exports = router;
