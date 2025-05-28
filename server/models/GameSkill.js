const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: String,
    score: Number,
    color: String,
});

const gameSkillSchema = new mongoose.Schema({
    name: String,
    icon: String,
    skills: [skillSchema],
});

module.exports = mongoose.model('GameSkills', gameSkillSchema);
