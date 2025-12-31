import { Router } from "express";
import { roleRequired, authRequired } from "../middleware/auth.js";
import { sites, trips, users, reviews } from "../store.js";

const r = Router();

r.use(authRequired);
r.use(roleRequired("admin"));

r.get("/sites", (req, res) => {
  res.json(sites);
});

r.get("/trips", (req, res) => {
  res.json(trips);
});

r.get("/users", (req, res) => {
  res.json(users.map(u => ({ id: u.id, email: u.email, role: u.role })));
});

r.get("/reviews", (req, res) => {
  res.json(reviews);
});

export default r;
