
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, gender, yearOfBirth, shortBio, country } = req.body;
        // if the user is updated their profile means, it is not a new user
        const isNewUser = false
        const user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: { firstName, lastName, gender, yearOfBirth, shortBio, country, isNewUser } },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}