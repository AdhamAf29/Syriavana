import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { bookings, cancelBooking } from "../store.js";

const r = Router();

r.get("/my", authRequired, (req, res) => {
  const list = bookings.filter(b => b.userId === req.user.id);
  res.json(list);
});

r.post("/:id/cancel", authRequired, (req, res) => {
  try {
    const b = cancelBooking({ bookingId: req.params.id, userId: req.user.id });
    res.json({ booking: b, message: "Your booking has been successfully canceled." });
  } catch (e) {
    if (e.message === "booking_not_found") return res.status(404).json({ error: "not_found" });
    if (e.message === "forbidden") return res.status(403).json({ error: "forbidden" });
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
