import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || "misc";
    // Ensure we are pointing to the root uploads directory
    // If running from root, 'uploads' is correct.
    const uploadPath = path.join(process.cwd(), "uploads", folder);
    
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  const folder = req.body.folder || "misc";
  // Return URL relative to server root
  // Assuming app serves /uploads
  const url = `/uploads/${folder}/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

export default router;
