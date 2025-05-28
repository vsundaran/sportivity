const GameSkill = require("../models/GameSkill");
const UserSkill = require("../models/UserSkill");


exports.getSkills = async (req, res) => {
    try {
        console.log(req.user.id, 'req.user.id')
        const userdata = await UserSkill.findOne({ userId: req.user.id })
        console.log(userdata, "userdata")
        const data = await GameSkill.find({ "name": userdata.primarySport });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch game skills' });
    }
}