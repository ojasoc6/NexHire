const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const authMiddleware = require("../middleware/auth");
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/inquiries — Send inquiry + trigger email
router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, freelancerId, message } = req.body;

    // Save inquiry to DB
    const inquiry = new Inquiry({
      clientName,
      clientEmail,
      freelancerId,
      message,
      status: "sent",
      statusHistory: [{ status: "sent", timestamp: new Date() }]
    });
    await inquiry.save();

    // Send confirmation email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: "Your inquiry has been sent — NexHire",
      html: `
        <h2>Hi ${clientName}!</h2>
        <p>Your inquiry has been successfully sent on NexHire.</p>
        <p><strong>Your message:</strong> ${message}</p>
        <p>You will be notified when the freelancer responds.</p>
        <br/>
        <p>— The NexHire Team</p>
      `
    });

    res.status(201).json({ message: "Inquiry sent successfully", inquiry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/inquiries/:freelancerId — Get all inquiries for a freelancer (protected)
router.get("/:freelancerId", authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ freelancerId: req.params.freelancerId });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/inquiries/:id/status — Update inquiry lifecycle status (protected)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["sent", "viewed", "responded", "accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date() } }
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json({ message: "Status updated", inquiry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/inquiries/:id/timeline — Get full status history
router.get("/:id/timeline", authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.json({ status: inquiry.status, timeline: inquiry.statusHistory });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;