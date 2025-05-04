import { connect } from '../config/db/connect.js';

// Mostrar todos los poderes
export const showPower = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM power"; // Selecciona todos los poderes
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los poderes
  } catch (error) {
    res.status(500).json({ error: "Error fetching power", details: error.message });
  }
};

// Mostrar un poder por ID
export const showPowerId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM power WHERE id = ?"; // Selecciona un poder específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Power not found" });
    res.status(200).json(result[0]); // Devuelve el poder encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching power", details: error.message });
  }
};

// Registrar un nuevo poder
export const addPower = async (req, res) => {
  try {
    const { type, value } = req.body; // Datos necesarios para registrar el poder
    if (!type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO power (type, value) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [type, value]);

    res.status(201).json({
      message: "Power added successfully",
      data: { id: result.insertId, type, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding power", details: error.message });
  }
};

// Actualizar un poder por ID
export const updatePower = async (req, res) => {
  try {
    const { type, value } = req.body; // Datos necesarios para actualizar
    if (!type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE power SET type=?, value=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [type, value, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Power not found" });

    res.status(200).json({
      message: "Power updated successfully",
      data: { type, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating power", details: error.message });
  }
};

// Eliminar un poder por ID
export const deletePower = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM power WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Power not found" });

    res.status(200).json({
      message: "Power deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting power", details: error.message });
  }
};