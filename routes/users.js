const router = require('express').Router();

const {
  validateId,
  validateUpdateUser,
} = require('../middlewares/validations');

const { updateUser, getUserInfo } = require('../controllers/users');

router.get('/me', validateId, getUserInfo);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
