const router = require('express').Router();

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { validateLogin, validateSignup } = require('../middlewares/validations');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser, signout } = require('../controllers/users');

router.post('/signin', validateLogin, login);
router.post('/signup', validateSignup, createUser);

router.use(auth);

router.post('/signout', signout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
