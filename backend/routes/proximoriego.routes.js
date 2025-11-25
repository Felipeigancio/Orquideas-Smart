import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const sql = `SELECT fecha_inicio FROM calendario WHERE fecha_inicio >= NOW() ORDER BY fecha_inicio ASC LIMIT 1`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: "Error al obtener el próximo riego" });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({ fecha_inicio: null });
    }
  });
});

export default router;
