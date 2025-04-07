const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// All users except self
router.get('/', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  try {
    const users = await db.any(
      'SELECT id, username FROM users WHERE id != $1 ORDER BY username',
      [currentUserId]
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Chat list (recent messages)
router.get("/conversations", authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  try {
    const chats = await db.any(`
      SELECT DISTINCT ON (least(sender_id, receiver_id), greatest(sender_id, receiver_id))
             m.*, u.username
      FROM messages m
      JOIN users u ON u.id = CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
      END
      WHERE $1 IN (m.sender_id, m.receiver_id)
      ORDER BY least(sender_id, receiver_id), greatest(sender_id, receiver_id), created_at DESC
    `, [currentUserId]);

    res.json(chats);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
