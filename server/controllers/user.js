const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(200).json({
                success: true,
                message: 'No name provided, returning empty user list.',
                users: []
            });
        }
        let query = {};
        if (name) {
            query.$or = [
                { firstName: { $regex: name, $options: 'i' } },
                { lastName: { $regex: name, $options: 'i' } }
            ];
        }
        const users = await User.find(query).select("firstName lastName profileImage shortBio country location");
        res.status(200).json({
            success: true,
            message: users.length ? 'Users found.' : 'No users matched the search criteria.',
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error occurred while fetching users.',
            error: error.message
        });
    }
};
