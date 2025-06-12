const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            res.status(200).json([]);
        }
        let query = {};
        if (name) {
            query.$or = [
                { firstName: { $regex: name, $options: 'i' } },
                { lastName: { $regex: name, $options: 'i' } }
            ];
        };
        const users = await User.find(query).select("firstName lastName profileImage shortBio country location");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
