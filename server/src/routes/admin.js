import { Router } from "express";
import { roleRequired, authRequired } from "../middleware/auth.js";
import Site from "../models/Site.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

const r = Router();

r.use(authRequired);
r.use(roleRequired("admin"));

r.get("/sites", async (req, res) => {
  const list = await Site.find();
  res.json(list);
});

r.get("/trips", async (req, res) => {
  const list = await Trip.find();
  res.json(list);
});

r.get("/users", async (req, res) => {
  const list = await User.find().select("-password");
  res.json(list);
});

r.get("/reviews", async (req, res) => {
  const list = await Review.find();
  res.json(list);
});

export default r;
