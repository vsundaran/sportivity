const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profile');

const upload = require('../middleware/multer');

router.get('/', auth, getProfile);
router.put('/', auth, upload.single('profileImage'), updateProfile);

module.exports = router;