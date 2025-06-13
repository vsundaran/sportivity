const UserSkill = require('../models/UserSkill');

exports.createUserSkill = async (req, res) => {
    try {
        const userSkill = new UserSkill({ ...req.body, userId: req.user.id });
        await userSkill.save();
        res.status(201).json({
            message: 'User skill created successfully',
            data: userSkill
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create user skill',
            error: error.message
        });
    }
};

exports.getUserSkill = async (req, res) => {
    try {
        const userSkill = await UserSkill.findOne({ userId: req.user.id });
        if (!userSkill) {
            return res.status(404).json({
                message: 'User skill not found',
                error: 'No user skill found for this user'
            });
        }
        res.json({
            message: 'User skill fetched successfully',
            data: userSkill
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch user skill',
            error: error.message
        });
    }
};

exports.updateUserSkill = async (req, res) => {
    try {
        const userSkill = await UserSkill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!userSkill) {
            return res.status(404).json({
                message: 'User skill not found',
                error: 'No user skill found with this ID'
            });
        }
        res.json({
            message: 'User skill updated successfully',
            data: userSkill
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to update user skill',
            error: error.message
        });
    }
};

exports.deleteUserSkill = async (req, res) => {
    try {
        const userSkill = await UserSkill.findByIdAndDelete(req.params.id);
        if (!userSkill) {
            return res.status(404).json({
                message: 'User skill not found',
                error: 'No user skill found with this ID'
            });
        }
        res.json({
            message: 'User skill deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete user skill',
            error: error.message
        });
    }
};

exports.getAllUserSkills = async (req, res) => {
    try {
        const userSkills = await UserSkill.find();
        res.json({
            message: 'All user skills fetched successfully',
            data: userSkills
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch user skills',
            error: error.message
        });
    }
};