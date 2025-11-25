import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM lecturas ORDER BY fecha DESC LIMIT 10", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

export default router;