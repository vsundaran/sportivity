const router = express.Router();
const express = require('express');
const auth = require('../middleware/auth');
const userSkillController = require('../controllers/userSkillController');

router.post('/', auth, userSkillController.createUserSkill);
router.get('/', auth, userSkillController.getAllUserSkills);
router.get('/:id', auth, userSkillController.getUserSkill);
router.put('/:id', auth, userSkillController.updateUserSkill);
router.delete('/:id', auth, userSkillController.deleteUserSkill);

module.exports = router;