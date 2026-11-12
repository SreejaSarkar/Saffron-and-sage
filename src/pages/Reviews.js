import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./Reviews.css";

function Stars({ value, onChange }) {
  const interactive = typeof onChange === "function";
  return (
    <div className={`stars ${interactive ? "stars--input" : ""}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= value ? "star is-on" : "star"}
          onClick={interactive ? () => onChange(n) : undefined}
          role={interactive ? "button" : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  function loadReviews() {
    api
      .getReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(loadReviews, []);

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "—";

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    try {
      await api.addReview(form);
      setStatus({ type: "success", text: "Thanks for your review!" });
      setForm({ name: "", rating: 5, comment: "" });
      loadReviews();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">{average} average · {reviews.length} reviews</p>
          <h1>Guest Reviews</h1>
          <p className="page__lead">
            What our guests say after their visit. Dined with us? Leave your own
            note below.
          </p>
        </div>
      </header>

      <div className="container reviews">
        <div className="reviews__list">
          {loading && <p className="muted">Loading reviews…</p>}
          {reviews.map((r) => (
            <article key={r.id} className="review card-surface">
              <div className="review__head">
                <h3>{r.name}</h3>
                <Stars value={r.rating} />
              </div>
              <p className="review__comment">“{r.comment}”</p>
              <span className="review__date">{r.date}</span>
            </article>
          ))}
        </div>

        <form className="reviews__form card-surface" onSubmit={submit}>
          <h3>Leave a review</h3>
          {status.text && (
            <p className={`alert alert--${status.type}`}>{status.text}</p>
          )}
          <label className="field">
            <span>Name *</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <div className="field">
            <span>Rating</span>
            <Stars
              value={form.rating}
              onChange={(n) => setForm({ ...form, rating: n })}
            />
          </div>
          <label className="field">
            <span>Your review *</span>
            <textarea
              rows="4"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="btn">
            Post review
          </button>
        </form>
      </div>
    </div>
  );
}
