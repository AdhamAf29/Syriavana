import express from "express";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-trips", authRequired, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.user.id });
    res.status(201).json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('sites');
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/:id/book", authRequired, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "not_found" });

    const { numberOfPeople, paymentMethod, busType, notes } = req.body;
    const numPeople = parseInt(numberOfPeople, 10);
    
    if (isNaN(numPeople) || numPeople < 1) {
       return res.status(400).json({ message: "Invalid number of people" });
    }

    if (typeof trip.seatsAvailable !== 'number') {
      trip.seatsAvailable = trip.totalSeats || 50; 
    }

    if (trip.seatsAvailable < numPeople) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      tripId: trip._id,
      numberOfPeople: numPeople,
      paymentMethod,
      busType,
      notes,
      companions: req.body.companions || []
    });

    trip.seatsAvailable -= numPeople;
    await trip.save();

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (e) {
    console.error("Booking Error:", e);
    res.status(500).json({ message: "Server error: " + e.message });
  }
});

export default router;
