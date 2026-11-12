const express = require("express");
const { load, save } = require("../data/db");

const router = express.Router();

// POST /api/newsletter -> subscribe an email address
router.post("/", (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: "A valid email is required." });

  const db = load();
  const normalized = email.trim().toLowerCase();
  if (db.subscribers.includes(normalized))
    return res.status(200).json({ message: "You're already on the list!" });

  db.subscribers.push(normalized);
  save(db);
  res.status(201).json({ message: "Subscribed! Watch your inbox for offers." });
});

module.exports = router;
