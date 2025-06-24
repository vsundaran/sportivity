const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createActivity,
  getActivities,
  saveActivity,
  getSavedActivity,
  removeSavedActivity,
} = require("../controllers/activity");

// Log activity
router.post("/", auth, createActivity);

// Get user activities
router.get("/", auth, getActivities);

// Save user activities
router.post("/save-activity", auth, saveActivity);
router.post("/remove-saved-activity", auth, removeSavedActivity);

router.get("/saved-activities", auth, getSavedActivity);

module.exports = router;
