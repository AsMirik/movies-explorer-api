const router = require('express').Router();

const { getAllSaveMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/', getAllSaveMovies);

router.post('/', createMovie);

router.delete('/_id', deleteMovieById);

module.exports = router;
