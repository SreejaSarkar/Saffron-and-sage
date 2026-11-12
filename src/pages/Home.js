import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .getMenu()
      .then((items) => setFeatured(items.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="eyebrow">Portland · Riverside District</p>
            <h1>
              Where flavour <br /> finds its roots.
            </h1>
            <p className="hero__lead">
              Modern Mediterranean plates built from the season's best produce,
              served in a warm, candlelit room by the water.
            </p>
            <div className="hero__actions">
              <Link to="/reservations" className="btn">
                Book a Table
              </Link>
              <Link to="/menu" className="btn btn--ghost">
                View Menu
              </Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="hero__plate">🍽️</div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section container">
        <div className="highlights">
          <div className="highlight">
            <span className="highlight__icon">🌱</span>
            <h3>Farm Fresh</h3>
            <p>Daily deliveries from growers within 50 miles.</p>
          </div>
          <div className="highlight">
            <span className="highlight__icon">👩‍🍳</span>
            <h3>Craft Kitchen</h3>
            <p>Everything made in-house, from pasta to pastry.</p>
          </div>
          <div className="highlight">
            <span className="highlight__icon">🍷</span>
            <h3>Natural Wines</h3>
            <p>A rotating list of small-batch, low-intervention wines.</p>
          </div>
          <div className="highlight">
            <span className="highlight__icon">🌙</span>
            <h3>Late Seatings</h3>
            <p>Open until 11pm on weekends for the night owls.</p>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      <section className="section container">
        <div className="section__head">
          <h2>This week's favourites</h2>
          <Link to="/menu" className="link">
            See the full menu →
          </Link>
        </div>
        <div className="cards">
          {featured.map((dish) => (
            <article key={dish.id} className="card">
              <div className="card__emoji">{dish.image}</div>
              <div className="card__body">
                <div className="card__row">
                  <h3>{dish.name}</h3>
                  <span className="price">${dish.price.toFixed(2)}</span>
                </div>
                <p>{dish.description}</p>
              </div>
            </article>
          ))}
          {featured.length === 0 && (
            <p className="muted">Loading today's picks…</p>
          )}
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <h2>Planning something special?</h2>
            <p>Private dining and tasting menus available for 8–30 guests.</p>
          </div>
          <Link to="/contact" className="btn btn--light">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
