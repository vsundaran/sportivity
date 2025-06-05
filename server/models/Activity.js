const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    selectedOptions: {
        type: [String],
        required: true,
    }
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sport: {
        type: String,
        required: true,
    },
    gameType: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // In hours or minutes — depends on your app logic
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    playerSlots: {
        type: Number,
        required: true,
    },
    isPlaying: {
        type: Boolean,
        default: false,
    },
    attributes: {
        type: [AttributeSchema],
        default: [],
    },
    isPaidActivity: {
        type: Boolean,
        default: false,
    },
    isVenueBooked: {
        type: Boolean,
        default: false,
    },
    isVisibleToInvited: {
        type: Boolean,
        default: false,
    },
    isClubActivity: {
        type: Boolean,
        default: false,
    },
    players: {
        type: [Number], // You may change to [mongoose.Schema.Types.ObjectId] if referencing user documents
        default: [],
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
