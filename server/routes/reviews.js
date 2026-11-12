const express = require("express");
const { load, save } = require("../data/db");

const router = express.Router();

// GET /api/reviews -> all reviews, newest first
router.get("/", (req, res) => {
  const db = load();
  const sorted = [...db.reviews].sort((a, b) => b.id - a.id);
  res.json(sorted);
});

// POST /api/reviews -> add a review
router.post("/", (req, res) => {
  const { name, rating, comment } = req.body || {};

  const errors = [];
  if (!name || !name.trim()) errors.push("Name is required.");
  const stars = Number(rating);
  if (!stars || stars < 1 || stars > 5)
    errors.push("Rating must be between 1 and 5.");
  if (!comment || comment.trim().length < 3)
    errors.push("Please leave a short comment.");

  if (errors.length) return res.status(400).json({ errors });

  const db = load();
  const review = {
    id: Date.now(),
    name: name.trim(),
    rating: stars,
    comment: comment.trim(),
    date: new Date().toISOString().slice(0, 10),
  };
  db.reviews.push(review);
  save(db);

  res.status(201).json({ message: "Thanks for your review!", review });
});

module.exports = router;
