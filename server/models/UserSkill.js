const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: String,
    score: Number
});

const userSkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model if you have one
        default: null
    },
    level: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    },
    primarySport: String,
    score: {
        type: Number,
        default: 0
    },
    skills: [skillSchema]
}, {
    timestamps: true,
    versionKey: '__v'
});

module.exports = mongoose.model('UserSkill', userSkillSchema);