const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profile');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

module.exports = router;