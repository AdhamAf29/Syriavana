import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authRequired(req, res, next) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(t, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "unauthorized" });
  }
}

export function roleRequired(role) {
  return function(req, res, next) {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: "forbidden" });
    next();
  };
}
