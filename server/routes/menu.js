const express = require("express");
const menu = require("../data/menu");

const router = express.Router();

// GET /api/menu  -> full menu, optionally filtered by ?category= or ?tag=
router.get("/", (req, res) => {
  const { category, tag } = req.query;
  let items = menu;

  if (category) {
    items = items.filter(
      (i) => i.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (tag) {
    items = items.filter((i) =>
      i.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
  }

  res.json(items);
});

// GET /api/menu/categories -> distinct category list
router.get("/categories", (req, res) => {
  const categories = [...new Set(menu.map((i) => i.category))];
  res.json(categories);
});

// GET /api/menu/:id -> single dish
router.get("/:id", (req, res) => {
  const item = menu.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Dish not found" });
  res.json(item);
});

module.exports = router;
