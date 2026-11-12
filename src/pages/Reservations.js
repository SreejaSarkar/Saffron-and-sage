import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Reservations.css";

const TIMES = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const today = new Date().toISOString().slice(0, 10);

const empty = {
  name: "",
  email: "",
  phone: "",
  date: today,
  time: "19:00",
  guests: 2,
  notes: "",
};

export default function Reservations() {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [availability, setAvailability] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Prefill name/email from the signed-in account.
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        email: f.email || user.email || "",
      }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setAvailability(null);
  }

  async function checkAvailability() {
    setErrors([]);
    try {
      const res = await api.checkAvailability(form.date, form.time);
      setAvailability(res);
    } catch (err) {
      setErrors([err.message]);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      const res = await api.createReservation({
        ...form,
        guests: Number(form.guests),
      });
      setConfirmation(res.reservation);
      setForm(empty);
      setAvailability(null);
    } catch (err) {
      setErrors(err.message.split(". ").filter(Boolean));
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="page">
        <div className="container">
          <div className="confirm">
            <div className="confirm__icon">✅</div>
            <h1>You're booked in!</h1>
            <p className="confirm__lead">
              Thanks {confirmation.name} — we can't wait to host you.
            </p>
            <div className="confirm__card">
              <div>
                <span>Confirmation</span>
                <strong>{confirmation.confirmation}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{confirmation.date}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{confirmation.time}</strong>
              </div>
              <div>
                <span>Guests</span>
                <strong>{confirmation.guests}</strong>
              </div>
            </div>
            <button
              className="btn"
              onClick={() => setConfirmation(null)}
            >
              Make another reservation
            </button>
            <Link to="/my-bookings" className="btn btn--ghost reserve__viewlink">
              View my bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">Open 7 days · 11am – late</p>
          <h1>Book a Table</h1>
          <p className="page__lead">
            Reserve your spot in a few clicks. For parties over 12, please use
            the contact page and we'll arrange private dining.
          </p>
        </div>
      </header>

      <div className="container reserve">
        <form className="reserve__form card-surface" onSubmit={submit}>
          {errors.length > 0 && (
            <div className="alert alert--error">
              <ul>
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="field-grid">
            <label className="field">
              <span>Full name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Email *</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Guests *</span>
              <select
                value={form.guests}
                onChange={(e) => update("guests", e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Date *</span>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Time *</span>
              <select
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Special requests</span>
            <textarea
              rows="3"
              placeholder="Allergies, celebrations, seating preferences…"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </label>

          <div className="reserve__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={checkAvailability}
            >
              Check availability
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Booking…" : "Confirm reservation"}
            </button>
          </div>

          {availability && (
            <p
              className={`availability ${
                availability.soldOut ? "is-full" : "is-open"
              }`}
            >
              {availability.soldOut
                ? "Sorry, that slot is fully booked — try another time."
                : `${availability.available} seats available at ${availability.time} on ${availability.date}.`}
            </p>
          )}
        </form>

        <aside className="reserve__aside card-surface">
          <h3>Good to know</h3>
          <ul className="ticks">
            <li>Tables are held for 15 minutes past your booking time.</li>
            <li>A card may be required to hold parties of 6+.</li>
            <li>Let us know about allergies — our kitchen can adapt.</li>
            <li>Walk-ins welcome at the bar on a first-come basis.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
