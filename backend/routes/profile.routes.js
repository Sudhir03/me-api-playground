const express = require("express");
const profileController = require("../controllers/profile.controller");

const router = express.Router();

router.get("/", profileController.getProfile);

router.put("/", profileController.createOrUpdateProfile);

router.get("/projects", profileController.getProjectsBySkill);

router.get("/skills/top", profileController.getTopSkills);

router.get("/search", profileController.searchProfile);

module.exports = router;
