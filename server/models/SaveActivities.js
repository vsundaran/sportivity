const mongoose = require("mongoose");

const savedActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Activity",
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// 🔒 Prevent duplicate saves
savedActivitySchema.index({ userId: 1, activityId: 1 }, { unique: true });

const SavedActivity = mongoose.model("SavedActivity", savedActivitySchema);

module.exports = SavedActivity;
