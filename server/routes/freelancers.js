const express = require("express");
const router = express.Router();
const Freelancer = require("../models/Freelancer");
const authMiddleware = require("../middleware/auth");

// GET /api/freelancers — Get all freelancers with optional filters
router.get("/", async (req, res) => {
  try {
    const { skills, minExp, maxRate, availability } = req.query;

    let filter = {};

    // Only show freelancers with at least a bio or skills filled in
    filter.bio = { $exists: true, $ne: "" };

    if (skills) {
      const skillArray = skills.split(",").map(s => s.trim());
      filter.skills = { $in: skillArray };
    }
    if (minExp) filter.experienceYears = { $gte: Number(minExp) };
    if (maxRate) filter.hourlyRate = { $lte: Number(maxRate) };
    if (availability) filter.availability = availability;

   const freelancers = await Freelancer.find(filter)
  .populate({
    path: 'userId',
    select: 'name email role',
    match: { role: 'freelancer' }
  });

// Filter out nulls (clients whose userId didn't match)
const filtered = freelancers.filter(f => f.userId !== null);
res.json(filtered);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// GET /api/freelancers/:id — Get single freelancer profile
router.get("/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id).populate("userId", "name email");
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/freelancers/:id — Update freelancer profile (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { bio, skills, hourlyRate, experienceYears, availability } = req.body;

    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      { bio, skills, hourlyRate, experienceYears, availability },
      { new: true }
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json({ message: "Profile updated", freelancer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/freelancers/:id/portfolio — Add a portfolio case study (protected)
router.post("/:id/portfolio", authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, role, challenges, outcome } = req.body;

    const freelancer = await Freelancer.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          portfolio: { title, description, techStack, role, challenges, outcome }
        }
      },
      { new: true }
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json({ message: "Portfolio item added", freelancer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;