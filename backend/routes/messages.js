const express = require("express");
const db = require("../db");
const router = express.Router();

// Send message
router.post("/", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  const msg = await db.one(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
    [sender_id, receiver_id, content]
  );
  res.json(msg);
});

// Get messages between 2 users
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const currentUserId = parseInt(req.headers["x-user-id"]);

  const msgs = await db.any(`
    SELECT * FROM messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `, [currentUserId, userId]);

  res.json(msgs);
});

// In your Express backend (Node.js)
router.get('/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [senderId, receiverId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
