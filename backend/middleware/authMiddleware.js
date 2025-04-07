const jwt = require("jsonwebtoken");
const SECRET = "your_jwt_secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // `user.id` will be available in next handlers
    next();
  });
};

module.exports = authenticateToken;
