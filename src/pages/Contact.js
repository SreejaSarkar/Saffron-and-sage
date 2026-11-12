import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./Contact.css";

export default function Contact() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getInfo().then(setInfo).catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "" });
    try {
      const res = await api.sendContact(form);
      setStatus({ type: "success", text: res.message });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">We'd love to hear from you</p>
          <h1>Contact</h1>
          <p className="page__lead">
            Questions, private events, or just saying hello — drop us a line and
            we'll get back within one business day.
          </p>
        </div>
      </header>

      <div className="container contact">
        <div className="contact__info card-surface">
          <h3>Find us</h3>
          <ul className="contact__list">
            <li>
              <span>📍</span>
              {info?.address || "48 Harbour Lane, Portland, OR"}
            </li>
            <li>
              <span>📞</span>
              {info?.phone || "+1 (503) 555-0147"}
            </li>
            <li>
              <span>✉️</span>
              {info?.email || "hello@saffronandsage.com"}
            </li>
          </ul>

          <h4>Opening hours</h4>
          <ul className="hours">
            {(info?.hours || []).map((h) => (
              <li key={h.day}>
                <span>{h.day}</span>
                <strong>{h.time}</strong>
              </li>
            ))}
          </ul>

          <div className="map" aria-hidden="true">
            🗺️ Riverside District, by the water
          </div>
        </div>

        <form className="contact__form card-surface" onSubmit={submit}>
          {status.text && (
            <p className={`alert alert--${status.type}`}>{status.text}</p>
          )}
          <label className="field">
            <span>Name *</span>
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
            <span>Subject</span>
            <input
              type="text"
              placeholder="e.g. Private dining enquiry"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Message *</span>
            <textarea
              rows="5"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
