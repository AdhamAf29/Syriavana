import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const r = Router();

r.post("/register", async (req, res) => {
  const { name, email, password, phone, address, role, companyProfile } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "invalid_input" });
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ error: "email_in_use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || "",
      email,
      password: passwordHash,
      phone: phone || "",
      address: address || "",
      role: role || "user",
      companyProfile: role === "company" ? companyProfile : undefined
    });

    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

r.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "invalid_input" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "user_not_found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "wrong_password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
