import express from "express";
import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get my trips (for company)
router.get("/my-trips", authRequired, async (req, res) => {
  try {
    const trips = await Trip.find({ 
      $or: [
        { userId: req.user.id },
        { companyId: req.user.id }
      ]
    });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Create trip
router.post("/", authRequired, async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.user.id });
    res.status(201).json(trip);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name')
      .populate('companyId', 'name')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get single trip
router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid trip ID" });
  }
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name')
      .populate('companyId', 'name');
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Book a trip
router.post("/:id/book", authRequired, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid trip ID" });
  }
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const { numberOfPeople, paymentMethod, busType, notes } = req.body;
    const numPeople = parseInt(numberOfPeople, 10);
    
    if (isNaN(numPeople) || numPeople < 1) {
       return res.status(400).json({ message: "Invalid number of people" });
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
      status: 'pending'
    });

    trip.seatsAvailable -= numPeople;
    await trip.save();

    res.status(201).json({ message: "Booking successful!", booking });
  } catch (e) {
    console.error("Booking Error:", e);
    res.status(500).json({ message: "Server error: " + e.message });
  }
});

export default router;
