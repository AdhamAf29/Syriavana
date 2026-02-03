import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

const r = Router();

r.post("/", authRequired, async (req, res) => {
  const { tripId, rating, comment } = req.body || {};
  if (!tripId || !rating) return res.status(400).json({ error: "invalid_input" });

  try {
    // Check if user has booked this trip
    const booking = await Booking.findOne({
      userId: req.user.id,
      tripId: tripId,
      bookingStatus: { $ne: "cancelled" }
    });

    if (!booking) {
      return res.status(403).json({ error: "must_book_first", message: "You must book this trip before leaving a review." });
    }

    const review = await Review.create({
      userId: req.user.id,
      tripId,
      rating,
      comment: comment || ""
    });

    res.status(201).json(review);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
