import { Router } from "express";
import Site from "../models/Site.js";

const r = Router();

r.get("/", async (req, res) => {
  const { province, type } = req.query;
  const query = {};
  if (province) query.province = { $regex: new RegExp(String(province), "i") }; // Case-insensitive
  if (type) query.type = { $regex: new RegExp(String(type), "i") };

  try {
    const list = await Site.find(query);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/:id", async (req, res) => {
  try {
    const s = await Site.findById(req.params.id);
    if (!s) return res.status(404).json({ error: "not_found" });
    res.json(s);
  } catch (e) {
    res.status(404).json({ error: "not_found" });
  }
});

export default r;
