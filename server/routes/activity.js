const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createActivity, getActivities } = require('../controllers/activity');

// Log activity
router.post('/', auth, createActivity);

// Get user activities
router.get('/', auth, getActivities);

module.exports = router;