import { Router } from "express";
import Trip from "../models/Trip.js";
import Booking from "../models/Booking.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Get all trips
r.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ active: true }).populate("companyId", "name companyProfile.logo");
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

// Create a new trip (Company or Admin)
r.post("/", authRequired, async (req, res) => {
  // Allow companies and admins
  if (req.user.role !== "company" && req.user.role !== "admin") {
    return res.status(403).json({ error: "forbidden" });
  }

  try {
    const tripData = {
      ...req.body,
      companyId: req.user.role === "company" ? req.user.id : null // Admin trips have no companyId or null
    };

    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Update a trip
r.put("/:id", authRequired, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "not_found" });

    // Check ownership
    if (req.user.role === "company" && trip.companyId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "forbidden" });
    }
    if (req.user.role !== "company" && req.user.role !== "admin") {
      return res.status(403).json({ error: "forbidden" });
    }

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Delete a trip
r.delete("/:id", authRequired, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "not_found" });

    // Check ownership
    if (req.user.role === "company" && trip.companyId?.toString() !== req.user.id) {
      return res.status(403).json({ error: "forbidden" });
    }
    if (req.user.role !== "company" && req.user.role !== "admin") {
      return res.status(403).json({ error: "forbidden" });
    }

    trip.active = false; // Soft delete
    await trip.save();
    res.json({ message: "Trip deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

// Get company's own trips
r.get("/my-trips", authRequired, async (req, res) => {
  if (req.user.role !== "company") return res.status(403).json({ error: "forbidden" });
  try {
    const trips = await Trip.find({ companyId: req.user.id });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/:id", async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id).populate("companyId", "name companyProfile");
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
