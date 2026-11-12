import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import "./Menu.css";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getMenu(), api.getCategories()])
      .then(([menu, cats]) => {
        setItems(menu);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const catOk = active === "All" || i.category === active;
      const vegOk = !vegOnly || i.tags.includes("vegetarian");
      return catOk && vegOk;
    });
  }, [items, active, vegOnly]);

  const tabs = ["All", ...categories];

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="eyebrow">Seasonal · Updated weekly</p>
          <h1>Our Menu</h1>
          <p className="page__lead">
            A Mediterranean menu that changes with the harvest. Ask your server
            about today's specials and wine pairings.
          </p>
        </div>
      </header>

      <div className="container">
        <div className="menu__controls">
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab ${active === t ? "is-active" : ""}`}
                onClick={() => setActive(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
            />
            <span>Vegetarian only</span>
          </label>
        </div>

        {loading && <p className="muted">Loading menu…</p>}
        {error && <p className="alert alert--error">{error}</p>}

        <div className="menu__list">
          {filtered.map((dish) => (
            <article key={dish.id} className="dish">
              <div className="dish__emoji">{dish.image}</div>
              <div className="dish__main">
                <div className="dish__row">
                  <h3>{dish.name}</h3>
                  <span className="dotted" />
                  <span className="price">${dish.price.toFixed(2)}</span>
                </div>
                <p className="dish__desc">{dish.description}</p>
                <div className="dish__tags">
                  {dish.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          {!loading && filtered.length === 0 && (
            <p className="muted">No dishes match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
