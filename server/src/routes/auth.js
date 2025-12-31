import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, verifyUser } from "../store.js";

const r = Router();

r.post("/register", (req, res) => {
  const { name, email, password, phone, address, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "invalid_input" });
  try {
    const user = createUser({ name: name || "", email, password, phone, address, role });
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (e) {
    if (e.message === "email_in_use") return res.status(409).json({ error: "email_in_use" });
    res.status(500).json({ error: "server_error" });
  }
});

r.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "invalid_input" });
  const user = verifyUser(email, password);
  if (!user) return res.status(401).json({ error: "invalid_credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

export default r;
