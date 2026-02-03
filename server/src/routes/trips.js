import { Router } from "express";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ active: true });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/:id", async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id);
    if (!t) return res.status(404).json({ error: "not_found" });
    res.json(t);
  } catch (e) {
    res.status(404).json({ error: "not_found" });
  }
});

r.post("/:id/book", authRequired, async (req, res) => {
  const { numberOfPeople, companions, paymentMethod, notes, busType } = req.body || {};
  if (!numberOfPeople || numberOfPeople < 1) return res.status(400).json({ error: "invalid_input" });

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "not_found" });

    if (trip.seatsAvailable < numberOfPeople) {
      return res.status(400).json({ error: "insufficient_seats" });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      tripId: trip._id,
      numberOfPeople,
      companions: companions || [],
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      busType: busType || "standard",
      bookingStatus: "confirmed" // Auto-confirm for now
    });

    // Update seats
    trip.seatsAvailable -= numberOfPeople;
    await trip.save();

    res.status(201).json({
      booking,
      message: "Booking successful — Please visit our Damascus office for payment and final details."
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
