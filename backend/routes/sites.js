import express from "express";
import mongoose from "mongoose";
import Site from "../models/Site.js";

const router = express.Router();

// Get all sites with filtering
router.get("/", async (req, res) => {
  try {
    const { province, type } = req.query;
    const query = {};
    if (province) query.province = province;
    if (type) query.type = type;
    
    const sites = await Site.find(query);
    res.json(sites);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get single site
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid site ID" });
  }
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found" });
    res.json(site);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
