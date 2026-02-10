import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import authRouter from "./routes/auth.js";
import tripsRouter from "./routes/trips.js";
import bookingsRouter from "./routes/bookings.js";
import sitesRouter from "./routes/sites.js";
import adminRouter from "./routes/admin.js";
import companiesRouter from "./routes/companies.js";
import uploadsRouter from "./routes/uploads.js";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/sites", sitesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/uploads", uploadsRouter);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
