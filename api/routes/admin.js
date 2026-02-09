import express from "express";
import User from "../models/User.js";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import Site from "../models/Site.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

const adminRequired = async (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin access required" });
  next();
};

router.use(authRequired, adminRequired);

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const trips = await Trip.countDocuments();
    const bookings = await Booking.countDocuments();
    const sites = await Site.countDocuments();
    
    const allBookings = await Booking.find().populate('tripId');
    const revenue = allBookings.reduce((acc, b) => {
      if (b.tripId) return acc + (b.tripId.price * b.numberOfPeople);
      return acc;
    }, 0);

    const bookingStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ users, trips, bookings, sites, revenue, bookingStatus });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/companies/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name').populate('tripId', 'title');
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
