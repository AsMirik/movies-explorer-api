const router = require('express').Router();

const {
  validateUpdateUser,
} = require('../middlewares/validations');

const { updateUser, getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
