const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    education: [
      {
        course: { type: String, required: true, trim: true },
        institute: { type: String, required: true },
        startedAt: { type: Date, required: true },
        completedAt: { type: Date },
        ongoing: { type: Boolean, default: false },
      },
    ],

    skills: [{ type: String, trim: true }],

    projects: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        skills: [{ type: String, trim: true }],
        links: {
          github: String,
          live: String,
        },
      },
    ],

    work: [
      {
        role: String,
        company: String,
        duration: String,
      },
    ],

    links: {
      github: { type: String, required: true },
      linkedin: { type: String, required: true },
      portfolio: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
