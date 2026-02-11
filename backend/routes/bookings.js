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

router.get("/my", authRequired, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('tripId')
      .sort({ createdAt: -1 });
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

router.post("/:id/cancel", authRequired, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    booking.status = 'cancelled';
    await booking.save();
    
    // Optional: Return seats to trip
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.seatsAvailable += booking.numberOfPeople;
      await trip.save();
    }
    
    res.json({ message: "Booking cancelled successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
