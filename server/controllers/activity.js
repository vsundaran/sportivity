const Activity = require('../models/Activity');

// Create a new activity
exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity({ ...req.body, userId: req.user.id });
        await activity.save();
        res.status(201).json({ message: "Saved Successfully", activity });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all activities
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({});
        res.json({ message: "Activities Fetched Successfully", activities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single activity by ID
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};