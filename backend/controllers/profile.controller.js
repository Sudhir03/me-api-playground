const Profile = require("../models/profile.model");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "education",
      "skills",
      "projects",
      "work",
      "links",
    ];

    const filteredData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        filteredData[field] = req.body[field];
      }
    });

    if (!filteredData.name || !filteredData.email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const profile = await Profile.findOneAndUpdate({}, filteredData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save profile" });
  }
};

exports.getProjectsBySkill = async (req, res) => {
  try {
    const rawSkill = req.query.skill;
    const skill = rawSkill?.trim().toLowerCase();

    const profile = await Profile.findOne().select("projects");

    if (!profile || !profile.projects) {
      return res.status(200).json({ projects: [] });
    }

    if (!skill) {
      return res.status(200).json({
        projects: profile.projects,
      });
    }

    const filteredProjects = profile.projects.filter(
      (p) =>
        Array.isArray(p.skills) &&
        p.skills.some((s) => s.toLowerCase() === skill)
    );

    return res.status(200).json({
      projects: filteredProjects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

exports.getTopSkills = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile || !profile.skills) {
      return res.status(200).json({ top: [] });
    }

    return res.status(200).json({
      success: true,
      top: profile.skills,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch top skills",
    });
  }
};

exports.searchProfile = async (req, res) => {
  try {
    const { q } = req.query;

    const query = q?.trim().toLowerCase();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const profile = await Profile.findOne().select("skills projects");

    if (!profile) {
      return res.status(200).json({
        skills: [],
        projects: [],
      });
    }

    const matchedSkills = profile.skills.filter((s) =>
      s.toLowerCase().includes(query)
    );

    const matchedProjects = profile.projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.skills.some((s) => s.toLowerCase().includes(query))
    );

    return res.status(200).json({
      success: true,
      skills: matchedSkills,
      projects: matchedProjects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to search profile",
    });
  }
};
