import express from "express";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/company", authRequired, async (req, res) => {
  try {
    const myTrips = await Trip.find({ userId: req.user.id }).select('_id');
    const tripIds = myTrips.map(t => t._id);
    
    const bookings = await Booking.find({ tripId: { $in: tripIds } })
      .populate('userId', 'name email')
      .populate('tripId', 'title startDate');
      
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/", authRequired, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('tripId');
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
