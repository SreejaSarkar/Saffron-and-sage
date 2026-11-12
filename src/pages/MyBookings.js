import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import "./MyBookings.css";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  function load() {
    setLoading(true);
    api
      .getMyReservations()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function cancel(id) {
    if (!window.confirm("Cancel this reservation?")) return;
    setCancelingId(id);
    setError("");
    try {
      await api.cancelReservation(id);
      setBookings((b) => b.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelingId(null);
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.date >= todayStr);
  const past = bookings.filter((b) => b.date < todayStr);

  function Row({ b, isPast }) {
    return (
      <article className={`booking card-surface ${isPast ? "is-past" : ""}`}>
        <div className="booking__date">
          <strong>{b.date}</strong>
          <span>{b.time}</span>
        </div>
        <div className="booking__details">
          <h3>
            {b.guests} {b.guests === 1 ? "guest" : "guests"}
          </h3>
          <p className="muted">Confirmation {b.confirmation}</p>
          {b.notes && <p className="booking__notes">“{b.notes}”</p>}
        </div>
        <div className="booking__actions">
          {isPast ? (
            <span className="badge">Completed</span>
          ) : (
            <button
              className="btn btn--ghost btn--small"
              onClick={() => cancel(b.id)}
              disabled={cancelingId === b.id}
            >
              {cancelingId === b.id ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">Hi {user?.name?.split(" ")[0] || "there"}</p>
          <h1>My Bookings</h1>
          <p className="page__lead">
            Your reservations at Saffron &amp; Sage. Cancel anytime up to your
            booking time.
          </p>
        </div>
      </header>

      <div className="container">
        {error && <p className="alert alert--error">{error}</p>}
        {loading && <p className="muted">Loading your bookings…</p>}

        {!loading && bookings.length === 0 && (
          <div className="empty card-surface">
            <div className="empty__icon">🍽️</div>
            <h3>No bookings yet</h3>
            <p className="muted">
              Reserve your first table and it'll show up here.
            </p>
            <Link to="/reservations" className="btn">
              Book a Table
            </Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="bookings">
            <h2 className="bookings__title">Upcoming</h2>
            <div className="bookings__list">
              {upcoming.map((b) => (
                <Row key={b.id} b={b} isPast={false} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="bookings">
            <h2 className="bookings__title">Past</h2>
            <div className="bookings__list">
              {past.map((b) => (
                <Row key={b.id} b={b} isPast={true} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
