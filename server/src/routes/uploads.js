import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authRequired } from "../middleware/auth.js";

const r = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = String(req.body.folder || "sites").replace(/[^a-zA-Z0-9_-]/g, "");
    const dir = path.join(process.cwd(), "uploads", folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}-${safe}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

r.post("/", authRequired, upload.single("file"), (req, res) => {
  const rel = req.file.path.replace(path.join(process.cwd(), "uploads"), "").replace(/\\/g, "/");
  const url = `/uploads${rel}`;
  res.status(201).json({ url, filename: req.file.filename });
});

export default r;
