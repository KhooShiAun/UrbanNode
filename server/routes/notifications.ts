import { Router } from "express";
import { pool } from "../db.ts";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM notifications ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;
  await pool.query(
    "UPDATE notifications SET is_read = true WHERE id = $1",
    [id]
  );
  res.json({ success: true });
});

export default router;