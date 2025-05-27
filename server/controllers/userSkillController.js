const UserSkill = require('../models/UserSkill');

exports.createUserSkill = async (req, res) => {
    try {
        const userSkill = new UserSkill({ ...req.body, userId: req.user.id });
        await userSkill.save();
        res.status(201).json(userSkill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserSkill = async (req, res) => {
    try {
        const userSkill = await UserSkill.findOne({ userId: req.user.id });
        if (!userSkill) {
            return res.status(404).json({ error: 'User skill not found' });
        }
        res.json(userSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ error: 'User skill not found' });
        }
        res.json(userSkill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUserSkill = async (req, res) => {
    try {
        const userSkill = await UserSkill.findByIdAndDelete(req.params.id);
        if (!userSkill) {
            return res.status(404).json({ error: 'User skill not found' });
        }
        res.json({ message: 'User skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUserSkills = async (req, res) => {
    try {
        const userSkills = await UserSkill.find();
        res.json(userSkills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};