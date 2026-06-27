import { Router } from "express";
import { pool } from "../db.ts";
import { requireAuth } from "../middleware.ts";

const router = Router();

// GET /api/notifications - Get caller's notifications
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/:id/read - Mark notification as read (owned by caller)
router.patch("/:id/read", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.session.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Notification not found or access denied" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;