import { Router } from "express";
import { sites } from "../store.js";

const r = Router();

r.get("/", (req, res) => {
  const { province, type } = req.query;
  let list = sites;
  if (province) list = list.filter(s => s.province.toLowerCase() === String(province).toLowerCase());
  if (type) list = list.filter(s => s.type.toLowerCase() === String(type).toLowerCase());
  res.json(list);
});

r.get("/:id", (req, res) => {
  const s = sites.find(x => x.id === req.params.id);
  if (!s) return res.status(404).json({ error: "not_found" });
  res.json(s);
});

export default r;
