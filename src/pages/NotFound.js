import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container notfound">
        <div className="notfound__emoji">🍽️</div>
        <h1>Page not found</h1>
        <p className="muted">
          The dish you're looking for isn't on the menu. Let's get you back.
        </p>
        <Link to="/" className="btn">
          Back to home
        </Link>
      </div>
    </div>
  );
}
