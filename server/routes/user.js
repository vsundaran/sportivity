const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUsers } = require('../controllers/user');

router.get('/', auth, getUsers);

module.exports = router;