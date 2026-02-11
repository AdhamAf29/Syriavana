import express from "express";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Review from "../models/Review.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' }).select('-password');
    res.json(companies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = 'company';
    user.companyProfile = {
      description: req.body.description,
      contactInfo: req.body.contactInfo,
      logo: req.body.logo
    };
    if (req.body.name) user.name = req.body.name;

    await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company = await User.findById(req.params.id).select('-password');
    if (!company || company.role !== 'company') {
      return res.status(404).json({ message: "Company not found" });
    }

    const trips = await Trip.find({ userId: company._id });
    const reviews = await Review.find({ targetId: company._id }).populate('userId', 'name');

    res.json({ company, trips, reviews });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/:id/reviews", authRequired, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      userId: req.user.id,
      targetId: req.params.id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
