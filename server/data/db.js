// Tiny JSON-file backed store. Good enough for a demo without a database.
const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "store.json");

const defaultData = {
  users: [],
  reservations: [],
  messages: [],
  reviews: [
    {
      id: 1,
      name: "Amara Patel",
      rating: 5,
      comment:
        "Easily the best risotto in the city. The saffron spritz is a must!",
      date: "2026-09-18",
    },
    {
      id: 2,
      name: "Daniel Okoro",
      rating: 5,
      comment: "Beautiful room, warm service and the lamb was cooked perfectly.",
      date: "2026-10-02",
    },
    {
      id: 3,
      name: "Sofia Rossi",
      rating: 4,
      comment: "Lovely evening. Desserts stole the show — the fondant is divine.",
      date: "2026-10-21",
    },
  ],
  subscribers: [],
};

function load() {
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(raw);
    // Backfill any keys added after the store file was first created.
    return { ...JSON.parse(JSON.stringify(defaultData)), ...data };
  } catch (err) {
    save(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function save(data) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
