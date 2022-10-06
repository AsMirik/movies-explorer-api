const router = require('express').Router();

const { updateUser, getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);

router.patch('/me', updateUser);

module.exports = router;
