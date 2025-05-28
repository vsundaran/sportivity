const express = require('express');
const router = express.Router();
const { getSkills } = require('../controllers/gameSkills');
const auth = require('../middleware/auth');

router.get('/', auth, getSkills);

module.exports = router;