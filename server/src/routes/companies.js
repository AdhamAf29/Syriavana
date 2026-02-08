import { Router } from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import CompanyReview from "../models/CompanyReview.js";
import Trip from "../models/Trip.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Create a new company profile
r.post("/", authRequired, async (req, res) => {
  const { name, description, contactInfo, logo } = req.body;
  if (!name) return res.status(400).json({ error: "name_required" });

  try {
    // Check if user already has a company
    const existing = await Company.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ error: "company_already_exists" });

    // Create company
    const company = await Company.create({
      userId: req.user.id,
      name,
      description,
      contactInfo,
      logo,
      status: "active" // Default to active for now
    });

    // Update user role
    req.user.role = "company";
    await req.user.save();

    res.status(201).json(company);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Get my company profile
r.get("/my", authRequired, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) return res.status(404).json({ error: "company_not_found" });
    res.json(company);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

// Get all active companies
r.get("/", async (req, res) => {
  try {
    const companies = await Company.find({ status: "active" }).lean();
    res.json(companies);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Get specific company profile with trips and reviews
r.get("/:id", async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, status: "active" }).lean();
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
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "company_not_found" });

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
