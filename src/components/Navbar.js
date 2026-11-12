import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Book a Table" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__logo">
            <img src="/logo-mark.svg" alt="Saffron & Sage" width="36" height="36" />
          </span>
          <span>
            Saffron <em>&amp;</em> Sage
          </span>
        </Link>

        <button
          className="navbar__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "is-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "is-active" : ""}`
                }
                onClick={() => setOpen(false)}
              >
                My Bookings
              </NavLink>
              <button
                className="btn btn--small btn--ghost navbar__cta"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn--small navbar__cta"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
