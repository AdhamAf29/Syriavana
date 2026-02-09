import express from "express";
import Site from "../models/Site.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
