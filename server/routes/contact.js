const express = require("express");
const { load, save } = require("../data/db");

const router = express.Router();

// POST /api/contact -> store a contact message
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body || {};

  const errors = [];
  if (!name || !name.trim()) errors.push("Name is required.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.push("A valid email is required.");
  if (!message || message.trim().length < 5)
    errors.push("Please enter a message of at least 5 characters.");

  if (errors.length) return res.status(400).json({ errors });

  const db = load();
  const entry = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: (subject || "General enquiry").trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  db.messages.push(entry);
  save(db);

  res.status(201).json({ message: "Thanks for reaching out — we'll reply soon!" });
});

module.exports = router;
