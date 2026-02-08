import { Router } from "express";
import { roleRequired, authRequired } from "../middleware/auth.js";
import Site from "../models/Site.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Company from "../models/Company.js";

const r = Router();

r.use(authRequired);
r.use(roleRequired("admin"));

r.get("/companies", async (req, res) => {
  try {
    const list = await Company.find().populate("userId", "name email");
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.delete("/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "not_found" });

    // 1. Revert user role
    await User.findByIdAndUpdate(company.userId, { role: "user" });

    // 2. Delete company trips
    await Trip.deleteMany({ companyId: company._id });

    // 3. Delete company
    await Company.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/sites", async (req, res) => {
  const list = await Site.find();
  res.json(list);
});

r.get("/trips", async (req, res) => {
  const list = await Trip.find();
  res.json(list);
});

r.get("/users", async (req, res) => {
  const list = await User.find().select("-password");
  res.json(list);
});

r.get("/reviews", async (req, res) => {
  const list = await Review.find();
  res.json(list);
});

export default r;
