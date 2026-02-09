import { Router } from "express";
import Trip from "../models/Trip.js";
import Company from "../models/Company.js";
import Booking from "../models/Booking.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Get all trips
r.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ active: true }).populate("companyId", "name logo");
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
    let companyId = null;

    if (req.user.role === "company") {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company) return res.status(400).json({ error: "company_profile_not_found" });
      companyId = company._id;
    }

    const tripData = {
      ...req.body,
      companyId
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
    if (req.user.role === "company") {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company || trip.companyId?.toString() !== company._id.toString()) {
        return res.status(403).json({ error: "forbidden" });
      }
    } else if (req.user.role !== "admin") {
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
    if (req.user.role === "company") {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company || trip.companyId?.toString() !== company._id.toString()) {
        return res.status(403).json({ error: "forbidden" });
      }
    } else if (req.user.role !== "admin") {
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
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) return res.json([]); // Return empty if no company profile

    const trips = await Trip.find({ companyId: company._id });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/:id", async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id).populate("companyId", "name logo");
    if (!t) return res.status(404).json({ error: "not_found" });
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

import fs from 'fs';
import path from 'path';

function logDebug(msg) {
  const logPath = path.join(process.cwd(), 'debug.log');
  const time = new Date().toISOString();
  fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
}

// Book a trip
r.post("/:id/book", authRequired, async (req, res) => {
  logDebug("--- Booking Request Start ---");
  logDebug("Trip ID: " + req.params.id);
  logDebug("User ID: " + req.user?.id);
  logDebug("Body: " + JSON.stringify(req.body));

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      logDebug("Trip not found");
      return res.status(404).json({ error: "not_found" });
    }

    logDebug("Trip found: " + trip.title);
    logDebug("Seats Available (before): " + trip.seatsAvailable);

    const { numberOfPeople, paymentMethod, busType, notes } = req.body;
    
    // Ensure numberOfPeople is a valid number
    const numPeople = parseInt(numberOfPeople, 10);
    if (isNaN(numPeople) || numPeople < 1) {
       logDebug("Invalid number of people: " + numberOfPeople);
       return res.status(400).json({ message: "Invalid number of people" });
    }

    // Fix seatsAvailable if missing or invalid
    if (typeof trip.seatsAvailable !== 'number') {
      logDebug("Fixing invalid seatsAvailable");
      trip.seatsAvailable = trip.totalSeats || 50; 
    }

    if (trip.seatsAvailable < numPeople) {
      logDebug("Not enough seats. Requested: " + numPeople + ", Available: " + trip.seatsAvailable);
      return res.status(400).json({ message: "Not enough seats available" });
    }

    logDebug("Creating booking object...");
    const bookingData = {
      userId: req.user.id,
      tripId: trip._id,
      numberOfPeople: numPeople,
      paymentMethod,
      busType,
      notes,
      companions: req.body.companions || []
    };
    logDebug("Booking Data: " + JSON.stringify(bookingData));

    const booking = await Booking.create(bookingData);
    logDebug("Booking created: " + booking._id);

    trip.seatsAvailable -= numPeople;
    await trip.save();
    logDebug("Trip updated. New seats: " + trip.seatsAvailable);

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (e) {
    logDebug("Booking Error Stack: " + e.stack);
    console.error("Booking Error Stack:", e.stack);
    res.status(500).json({ message: "Server error: " + e.message });
  } finally {
    logDebug("--- Booking Request End ---");
  }
});

export default r;
