import { Router } from "express";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();

// Get bookings for company's trips
r.get("/company", authRequired, async (req, res) => {
  if (req.user.role !== "company") return res.status(403).json({ error: "forbidden" });
  try {
    // Find all trips by this company
    const trips = await Trip.find({ companyId: req.user.id }).select("_id");
    const tripIds = trips.map(t => t._id);

    // Find bookings for these trips
    const bookings = await Booking.find({ tripId: { $in: tripIds } })
      .populate("tripId", "title startDate")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

r.get("/my", authRequired, async (req, res) => {
  try {
    const list = await Booking.find({ userId: req.user.id }).populate("tripId");
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
});

r.post("/:id/cancel", authRequired, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ error: "not_found" });
    
    if (b.userId.toString() !== req.user.id) return res.status(403).json({ error: "forbidden" });

    if (b.bookingStatus === "cancelled") {
      return res.json({ booking: b, message: "Already cancelled." });
    }

    b.bookingStatus = "cancelled";
    await b.save();

    // Restore seats
    const trip = await Trip.findById(b.tripId);
    if (trip) {
      trip.seatsAvailable += b.numberOfPeople;
      await trip.save();
    }

    res.json({ booking: b, message: "Your booking has been successfully canceled." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
