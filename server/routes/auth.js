const express = require("express");
const bcrypt = require("bcryptjs");
const { load, save } = require("../data/db");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  const errors = [];
  if (!name || !name.trim()) errors.push("Name is required.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    errors.push("A valid email is required.");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters.");
  if (errors.length) return res.status(400).json({ errors });

  const db = load();
  const normalized = email.trim().toLowerCase();
  if (db.users.some((u) => u.email === normalized))
    return res.status(409).json({ error: "An account with this email already exists." });

  const user = {
    id: Date.now(),
    name: name.trim(),
    email: normalized,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  save(db);

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  const db = load();
  const user = db.users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ error: "Invalid email or password." });

  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/me -> current user
router.get("/me", requireAuth, (req, res) => {
  const db = load();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
});

module.exports = router;
