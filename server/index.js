const express = require("express");
const cors = require("cors");

const menuRoutes = require("./routes/menu");
const reservationRoutes = require("./routes/reservations");
const contactRoutes = require("./routes/contact");
const reviewRoutes = require("./routes/reviews");
const newsletterRoutes = require("./routes/newsletter");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Restaurant info served to the frontend (About / Contact / Footer).
const info = {
  name: "Saffron & Sage",
  tagline: "Modern Mediterranean dining, rooted in seasonal produce.",
  address: "48 Harbour Lane, Riverside District, Portland, OR 97201",
  phone: "+1 (503) 555-0147",
  email: "hello@saffronandsage.com",
  hours: [
    { day: "Monday – Thursday", time: "11:00 – 22:00" },
    { day: "Friday – Saturday", time: "11:00 – 23:00" },
    { day: "Sunday", time: "12:00 – 21:00" },
  ],
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
  },
};

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api/info", (req, res) => res.json(info));

app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`🍽  Saffron & Sage API running on http://localhost:${PORT}`);
});
