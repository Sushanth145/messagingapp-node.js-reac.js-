const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

const SECRET = "your_jwt_secret";

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await db.one("INSERT INTO users(username, password) VALUES($1, $2) RETURNING *", [username, hashed]);
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [username]);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

module.exports = router;
