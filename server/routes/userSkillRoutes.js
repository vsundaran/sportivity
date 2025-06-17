const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userSkillController = require("../controllers/userSkill");

router.get("/", auth, userSkillController.getUserSkill);
router.post("/", auth, userSkillController.createOrUpdateUserSkill);
router.get("/all", auth, userSkillController.getAllUserSkills);
router.put("/:id", auth, userSkillController.updateUserSkill);
router.delete("/:id", auth, userSkillController.deleteUserSkill);

module.exports = router;
