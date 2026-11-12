const jwt = require("jsonwebtoken");

// Use an env secret in production; this fallback keeps local dev simple.
const JWT_SECRET = process.env.JWT_SECRET || "saffron-sage-dev-secret";
const TOKEN_TTL = "7d";

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

// Express middleware: require a valid Bearer token, attach req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication required." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

module.exports = { signToken, requireAuth, JWT_SECRET };
