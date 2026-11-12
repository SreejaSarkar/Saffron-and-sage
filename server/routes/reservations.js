const express = require("express");
const { load, save } = require("../data/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Restaurant opening hours used to validate reservation times.
const OPEN_HOUR = 11; // 11:00
const CLOSE_HOUR = 22; // last seating 22:00
const MAX_PARTY = 12;

function isValidDate(dateStr) {
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime());
}

// GET /api/reservations/mine -> reservations for the logged-in user
router.get("/mine", requireAuth, (req, res) => {
  const db = load();
  const mine = db.reservations
    .filter((r) => r.userId === req.user.id)
    .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
  res.json(mine);
});

// GET /api/reservations/availability?date=&time= -> remaining seats
router.get("/availability", (req, res) => {
  const { date, time } = req.query;
  if (!date || !time) {
    return res.status(400).json({ error: "date and time are required" });
  }

  const db = load();
  const TOTAL_SEATS = 60;
  const booked = db.reservations
    .filter((r) => r.date === date && r.time === time)
    .reduce((sum, r) => sum + r.guests, 0);

  const available = Math.max(TOTAL_SEATS - booked, 0);
  res.json({ date, time, available, soldOut: available === 0 });
});

// POST /api/reservations -> create a reservation (login required)
router.post("/", requireAuth, (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body || {};

  const errors = [];
  if (!name || !name.trim()) errors.push("Name is required.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.push("A valid email is required.");
  if (!date || !isValidDate(date)) errors.push("A valid date is required.");
  if (!time) errors.push("A time is required.");
  const partySize = Number(guests);
  if (!partySize || partySize < 1 || partySize > MAX_PARTY)
    errors.push(`Party size must be between 1 and ${MAX_PARTY}.`);

  if (time) {
    const hour = Number(String(time).split(":")[0]);
    if (hour < OPEN_HOUR || hour >= CLOSE_HOUR)
      errors.push(`We seat guests between ${OPEN_HOUR}:00 and ${CLOSE_HOUR}:00.`);
  }

  if (errors.length) return res.status(400).json({ errors });

  const db = load();
  const reservation = {
    id: Date.now(),
    userId: req.user.id,
    name: name.trim(),
    email: email.trim(),
    phone: (phone || "").trim(),
    date,
    time,
    guests: partySize,
    notes: (notes || "").trim(),
    createdAt: new Date().toISOString(),
    confirmation: `SS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };

  db.reservations.push(reservation);
  save(db);

  res.status(201).json({
    message: "Your table is booked! A confirmation has been reserved for you.",
    reservation,
  });
});

// DELETE /api/reservations/:id -> cancel a reservation (owner only)
router.delete("/:id", requireAuth, (req, res) => {
  const db = load();
  const reservation = db.reservations.find(
    (r) => r.id === Number(req.params.id)
  );
  if (!reservation)
    return res.status(404).json({ error: "Reservation not found" });
  if (reservation.userId !== req.user.id)
    return res.status(403).json({ error: "You can only cancel your own bookings." });

  db.reservations = db.reservations.filter(
    (r) => r.id !== Number(req.params.id)
  );
  save(db);
  res.json({ message: "Reservation cancelled." });
});

module.exports = router;
