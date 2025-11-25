import express from "express";
import { db } from "../db.js";

const router = express.Router();


router.get("/", (req, res) => {
  db.query("SELECT * FROM calendario ORDER BY fecha_inicio ASC", (err, results) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


router.post("/", (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_fin } = req.body;

  if (!titulo || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const sql = "INSERT INTO calendario (titulo, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)";
  db.query(sql, [titulo, descripcion, fecha_inicio, fecha_fin], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al crear evento" });
    res.json({ message: "Evento creado exitosamente", id: results.insertId });
  });
});


router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_inicio, fecha_fin } = req.body;

  const sql = "UPDATE calendario SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?";
  db.query(sql, [titulo, descripcion, fecha_inicio, fecha_fin, id], (err) => {
    if (err) return res.status(500).json({ error: "Error al actualizar evento" });
    res.json({ message: "Evento actualizado exitosamente" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM calendario WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Error al eliminar evento" });
    res.json({ message: "Evento eliminado exitosamente" });
  });
});

export default router;
