import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import User from "../models/User.js";

const r = Router();

r.post("/:id/favorites", authRequired, async (req, res) => {
  const { siteId, action } = req.body || {};
  if (!siteId) return res.status(400).json({ error: "invalid_input" });
  if (req.user.id !== req.params.id && req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });

  try {
    let update;
    if (action === "remove") {
      update = { $pull: { favorites: siteId } };
    } else {
      update = { $addToSet: { favorites: siteId } };
    }

    const u = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!u) return res.status(404).json({ error: "user_not_found" });

    res.json({ favorites: u.favorites });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/:id", authRequired, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  try {
    const u = await User.findById(req.params.id).populate("favorites");
    if (!u) return res.status(404).json({ error: "not_found" });
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, favorites: u.favorites });
  } catch (e) {
    res.status(404).json({ error: "not_found" });
  }
});

export default r;
