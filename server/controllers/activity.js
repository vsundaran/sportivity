const Activity = require('../models/Activity');
/**
 * Create a new activity
 */
exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity({ ...req.body, userId: req.user.id });
        await activity.save();
        res.status(201).json({ success: true, message: "Activity saved successfully", activity });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to save activity", error: error.message });
    }
};

/**
 * Get all activities
 */
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({});
        res.json({ success: true, message: "Activities fetched successfully", activities });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch activities", error: error.message });
    }
};

/**
 * Get a single activity by ID
 */
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: "Activity fetched successfully", activity });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch activity", error: error.message });
    }
};

/**
 * Update an activity
 */
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: "Activity updated successfully", activity });
    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to update activity", error: error.message });
    }
};

/**
 * Delete an activity
 */
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete activity", error: error.message });
    }
};