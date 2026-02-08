import { Router } from "express";
import User from "../models/User.js";
import CompanyReview from "../models/CompanyReview.js";
import Trip from "../models/Trip.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Get all companies
r.get("/", async (req, res) => {
  try {
    const companies = await User.find({ role: "company" })
      .select("name email companyProfile")
      .lean();
    res.json(companies);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Get specific company profile with trips and reviews
r.get("/:id", async (req, res) => {
  try {
    const company = await User.findOne({ _id: req.params.id, role: "company" })
      .select("-password")
      .lean();
    
    if (!company) return res.status(404).json({ error: "company_not_found" });

    // Fetch active trips
    const trips = await Trip.find({ companyId: req.params.id, active: true });

    // Fetch reviews
    const reviews = await CompanyReview.find({ companyId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ ...company, trips, reviews });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Add review for a company
r.post("/:id/reviews", authRequired, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ error: "rating_required" });

  try {
    const review = await CompanyReview.create({
      userId: req.user.id,
      companyId: req.params.id,
      rating,
      comment
    });
    
    const populatedReview = await CompanyReview.findById(review._id).populate("userId", "name");
    res.status(201).json(populatedReview);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
