// const Activity = require("../models/Activity");
// const SavedActivity = require("../models/SaveActivities");
// /**
//  * Create a new activity
//  */
// exports.createActivity = async (req, res) => {
//   try {
//     const activity = new Activity({ ...req.body, userId: req.user.id });
//     await activity.save();
//     res.status(201).json({
//       success: true,
//       message: "Activity saved successfully",
//       activity,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to save activity",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Get all activities
//  */
// exports.getActivities = async (req, res) => {
//   try {
//     const activities = await Activity.find({});
//     res.json({
//       success: true,
//       message: "Activities fetched successfully",
//       activities,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch activities",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Save activities
//  */
// exports.saveActivity = async (req, res) => {
//   const { activityId } = req.body;
//   const userId = req.user.id;
//   try {
//     const saved = new SavedActivity({ userId, activityId });
//     const savedResponse = await saved.save();
//     res.status(201).json({
//       success: true,
//       message: "Activity saved successfully",
//       savedResponse,
//     });
//   } catch (err) {
//     if (err.code === 11000) {
//       // Duplicate key error (activity already saved)
//       return res.status(409).json({
//         success: false,
//         message: "Activity already saved",
//         error: err.message,
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Failed to save activity",
//       error: err.message,
//     });
//   }
// };

// /**
//  * Get Saved activities
//  */
// exports.getSavedActivity = async (req, res) => {
//   try {
//     const savedActivities = await SavedActivity.find({ userId: req.user.id })
//       .populate("activityId")
//       .sort({ savedAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Saved activities fetched successfully",
//       savedActivities,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch saved activities",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Get a single activity by ID
//  */
// exports.getActivityById = async (req, res) => {
//   try {
//     const activity = await Activity.findById(req.params.id);
//     if (!activity) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Activity not found" });
//     }
//     res.json({
//       success: true,
//       message: "Activity fetched successfully",
//       activity,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch activity",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Update an activity
//  */
// exports.updateActivity = async (req, res) => {
//   try {
//     const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!activity) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Activity not found" });
//     }
//     res.json({
//       success: true,
//       message: "Activity updated successfully",
//       activity,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Failed to update activity",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Delete an activity
//  */
// exports.deleteActivity = async (req, res) => {
//   try {
//     const activity = await Activity.findByIdAndDelete(req.params.id);
//     if (!activity) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Activity not found" });
//     }
//     res.json({ success: true, message: "Activity deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete activity",
//       error: error.message,
//     });
//   }
// };

const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const SavedActivity = require("../models/SaveActivities");

/**
 * Create a new activity
 */
exports.createActivity = async (req, res) => {
  try {
    const activity = new Activity({ ...req.body, userId: req.user.id });
    await activity.save();
    res.status(201).json({
      success: true,
      message: "Activity saved successfully",
      activity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to save activity",
      error: error.message,
    });
  }
};

/**
 * Get all activities with saved status for current user
 */
exports.getActivities = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: "savedactivities", // collection name in MongoDB
          let: { activityId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$activityId", "$$activityId"] },
                    { $eq: ["$userId", userId] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "savedInfo",
        },
      },
      {
        $addFields: {
          isSaved: { $gt: [{ $size: "$savedInfo" }, 0] },
        },
      },
      {
        $project: {
          savedInfo: 0, // Remove raw lookup result
        },
      },
    ]);

    res.json({
      success: true,
      message: "Activities fetched successfully",
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

/**
 * Save activities
 */
exports.saveActivity = async (req, res) => {
  const { activityId } = req.body;
  const userId = req.user.id;
  try {
    const saved = new SavedActivity({ userId, activityId });
    const savedResponse = await saved.save();
    res.status(201).json({
      success: true,
      message: "Activity saved successfully",
      savedResponse,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (activity already saved)
      return res.status(409).json({
        success: false,
        message: "Activity already saved",
        error: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to save activity",
      error: err.message,
    });
  }
};

/**
 * Get saved activities
 */
exports.getSavedActivity = async (req, res) => {
  try {
    const savedActivities = await SavedActivity.find({ userId: req.user.id })
      .populate("activityId")
      .sort({ savedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Saved activities fetched successfully",
      savedActivities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch saved activities",
      error: error.message,
    });
  }
};

/**
 * Get a single activity by ID
 */
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    res.json({
      success: true,
      message: "Activity fetched successfully",
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: error.message,
    });
  }
};

/**
 * Update an activity
 */
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    res.json({
      success: true,
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update activity",
      error: error.message,
    });
  }
};

/**
 * Delete an activity
 */
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    res.json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: error.message,
    });
  }
};
