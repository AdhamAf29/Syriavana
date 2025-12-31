import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { canReview, addReview } from "../store.js";

const r = Router();

r.post("/", authRequired, (req, res) => {
  const { tripId, rating, comment } = req.body || {};
  if (!tripId || !rating) return res.status(400).json({ error: "invalid_input" });
  if (!canReview(req.user.id, tripId)) return res.status(403).json({ error: "must_book_first", message: "You must book this trip before leaving a review." });
  const review = addReview({ userId: req.user.id, tripId, rating, comment });
  res.status(201).json(review);
});

export default r;
