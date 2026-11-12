# Saffron & Sage 🌿

A full-stack restaurant website built with a **React** frontend and an **Express** backend.
Browse the seasonal menu, book a table, read and leave reviews, and get in touch.

## Features

- **Home** — hero, highlights, and this week's featured dishes (pulled from the API)
- **Menu** — category tabs, a "vegetarian only" filter, prices, and dietary tags
- **Book a Table** — reservation form with live availability check and booking confirmation
- **About** — the restaurant story, team, and stats
- **Reviews** — read guest reviews and submit your own with a star rating
- **Contact** — contact form, opening hours, and location info
- **Newsletter** — email sign-up in the footer

## Project structure

```
.
├── public/            # CRA static assets
├── src/               # React frontend
│   ├── api.js         # fetch wrapper for the backend
│   ├── components/    # Navbar, Footer, ScrollToTop
│   └── pages/         # Home, Menu, Reservations, About, Reviews, Contact, NotFound
└── server/            # Express backend
    ├── index.js       # app entry + /api/info & /api/health
    ├── data/          # menu + JSON-file store
    └── routes/        # menu, reservations, contact, reviews, newsletter
```

## Getting started

Install dependencies for both the client and the server:

```bash
npm install
npm run server:install
```

### Run both at once (recommended)

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

The frontend proxies `/api` requests to the backend (see `proxy` in `package.json`).

### Run them separately

```bash
npm run server   # start the Express API on :5000
npm start        # start the React dev server on :3000
```

## API overview

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | --------------------------------- |
| GET    | `/api/info`                      | Restaurant info (address, hours)  |
| GET    | `/api/menu`                      | Menu items (`?category=`, `?tag=`)|
| GET    | `/api/menu/categories`           | Distinct categories               |
| GET    | `/api/reservations/availability` | Seats left for a date/time        |
| POST   | `/api/reservations`              | Create a reservation              |
| POST   | `/api/contact`                   | Send a contact message            |
| GET    | `/api/reviews`                   | List reviews                      |
| POST   | `/api/reviews`                   | Add a review                      |
| POST   | `/api/newsletter`                | Subscribe to the newsletter       |

Data is persisted to `server/data/store.json` (created automatically).
