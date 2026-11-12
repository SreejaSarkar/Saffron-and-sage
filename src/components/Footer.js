import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Footer.css";

export default function Footer() {
  const [info, setInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getInfo().then(setInfo).catch(() => {});
  }, []);

  async function subscribe(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.subscribe(email);
      setMsg(res.message);
      setEmail("");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <h3 className="footer__brand">
            <img
              src="/logo-mark.svg"
              alt="Saffron & Sage"
              width="28"
              height="28"
            />
            Saffron &amp; Sage
          </h3>
          <p>{info?.tagline || "Modern Mediterranean dining."}</p>
          <div className="footer__social">
            <a href={info?.social?.instagram || "#"} aria-label="Instagram">
              Instagram
            </a>
            <a href={info?.social?.facebook || "#"} aria-label="Facebook">
              Facebook
            </a>
            <a href={info?.social?.twitter || "#"} aria-label="Twitter">
              Twitter
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Visit us</h4>
          <p>{info?.address}</p>
          <p>{info?.phone}</p>
          <p>{info?.email}</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul className="footer__links">
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/reservations">Book a Table</Link>
            </li>
            <li>
              <Link to="/about">Our Story</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Newsletter</h4>
          <p>Seasonal menus &amp; events, straight to your inbox.</p>
          <form className="footer__newsletter" onSubmit={subscribe}>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn--small" type="submit">
              Join
            </button>
          </form>
          {msg && <p className="footer__msg">{msg}</p>}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Saffron &amp; Sage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
