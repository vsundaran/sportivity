const GameSkill = require("../models/GameSkill");
const UserSkill = require("../models/UserSkill");

exports.getSkills = async (req, res) => {
    try {
        console.log(req.user.id, 'req.user.id');
        const userdata = await UserSkill.findOne({ userId: req.user.id });
        console.log(userdata, "userdata");
        if (!userdata) {
            return res.status(404).json({ success: false, message: 'User skills not found' });
        }
        const data = await GameSkill.findOne({ "name": userdata.primarySport });
        if (!data) {
            return res.status(404).json({ success: false, message: 'Game skills not found for the primary sport' });
        }
        res.json({ success: true, message: 'Game skills fetched successfully', data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch game skills', error: err.message });
    }
}