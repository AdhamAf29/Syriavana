import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { addFavorite, removeFavorite, users } from "../store.js";

const r = Router();

r.post("/:id/favorites", authRequired, (req, res) => {
  const { siteId, action } = req.body || {};
  if (!siteId) return res.status(400).json({ error: "invalid_input" });
  if (req.user.id !== req.params.id && req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  try {
    if (action === "remove") {
      const u = removeFavorite(req.params.id, siteId);
      return res.json({ favorites: u.favorites });
    }
    const u = addFavorite(req.params.id, siteId);
    res.json({ favorites: u.favorites });
  } catch (e) {
    res.status(404).json({ error: "user_not_found" });
  }
});

r.get("/:id", authRequired, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const u = users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ error: "not_found" });
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role, favorites: u.favorites });
});

export default r;
