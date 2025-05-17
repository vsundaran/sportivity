const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Log activity
router.post('/', auth, async (req, res) => {
  try {
    const { action, details } = req.body;
    const activity = new Activity({
      userEmail: req.user.email,
      action,
      details
    });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userEmail: req.user.email })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;