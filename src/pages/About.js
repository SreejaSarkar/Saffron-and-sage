import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">Est. 2019</p>
          <h1>Our Story</h1>
          <p className="page__lead">
            Saffron &amp; Sage began as a weekend supper club and grew into a
            neighbourhood favourite — still run by the same two friends who
            started it.
          </p>
        </div>
      </header>

      <section className="section container about__intro">
        <div className="about__text">
          <h2>Rooted in the season</h2>
          <p>
            We cook what's growing. Every week our menu shifts with what arrives
            from local farms and the coast, so no two visits are quite the same.
            Our kitchen leans on the bright, sun-soaked flavours of the
            Mediterranean — olive oil, citrus, herbs and smoke.
          </p>
          <p>
            The room is small by design: 60 seats, open kitchen, and a bar where
            you can watch the pass. We'd rather do a few things beautifully than
            many things at scale.
          </p>
          <Link to="/reservations" className="btn">
            Join us for dinner
          </Link>
        </div>
        <div className="about__art" aria-hidden="true">
          🫒🍋🌿
        </div>
      </section>

      <section className="section container">
        <h2 className="center">The people behind the pass</h2>
        <div className="team">
          <div className="team__member">
            <div className="team__avatar">👨‍🍳</div>
            <h3>Marco Alvisi</h3>
            <p className="muted">Head Chef &amp; Co-founder</p>
            <p>
              Trained in Bologna, Marco builds the menu around whatever is at its
              peak that week.
            </p>
          </div>
          <div className="team__member">
            <div className="team__avatar">👩‍🍳</div>
            <h3>Lena Haddad</h3>
            <p className="muted">Pastry &amp; Co-founder</p>
            <p>
              Lena's desserts are the reason regulars save room — the fondant is
              non-negotiable.
            </p>
          </div>
          <div className="team__member">
            <div className="team__avatar">🧑‍🍷</div>
            <h3>Theo Nguyen</h3>
            <p className="muted">Sommelier</p>
            <p>
              Theo curates a natural wine list that changes almost as often as
              the menu.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="stats">
          <div className="stat">
            <strong>2019</strong>
            <span>Opened our doors</span>
          </div>
          <div className="stat">
            <strong>50 mi</strong>
            <span>Max distance for produce</span>
          </div>
          <div className="stat">
            <strong>60</strong>
            <span>Seats in the room</span>
          </div>
          <div className="stat">
            <strong>4.8★</strong>
            <span>Average guest rating</span>
          </div>
        </div>
      </section>
    </div>
  );
}
