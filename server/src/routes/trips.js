import { Router } from "express";
import { trips } from "../store.js";
import { authRequired } from "../middleware/auth.js";
import { createBooking } from "../store.js";

const r = Router();

r.get("/", (req, res) => {
  res.json(trips);
});

r.get("/:id", (req, res) => {
  const t = trips.find(x => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: "not_found" });
  res.json(t);
});

r.post("/:id/book", authRequired, (req, res) => {
  const { numberOfPeople, companions, paymentMethod, notes, busType } = req.body || {};
  if (!numberOfPeople || numberOfPeople < 1) return res.status(400).json({ error: "invalid_input" });
  try {
    const b = createBooking({ userId: req.user.id, tripId: req.params.id, numberOfPeople, companions, paymentMethod, notes, busType });
    res.status(201).json({ booking: b, message: "Booking successful — Please visit our Damascus office for payment and final details." });
  } catch (e) {
    if (e.message === "insufficient_seats") return res.status(400).json({ error: "insufficient_seats" });
    if (e.message === "trip_not_found") return res.status(404).json({ error: "not_found" });
    res.status(500).json({ error: "server_error" });
  }
});

export default r;
