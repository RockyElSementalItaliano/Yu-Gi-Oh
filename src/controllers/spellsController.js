import { connect } from '../config/db/connect.js';

// Mostrar todos los hechizos
export const showSpells = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM spells"; // Selecciona todos los hechizos
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los hechizos
  } catch (error) {
    res.status(500).json({ error: "Error fetching spells", details: error.message });
  }
};

// Mostrar un hechizo por ID
export const showSpellsId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM spells WHERE id = ?"; // Selecciona un hechizo específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Spell not found" });
    res.status(200).json(result[0]); // Devuelve el hechizo encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching spell", details: error.message });
  }
};

// Registrar un nuevo hechizo
export const addSpells = async (req, res) => {
  try {
    const { name, type, description, value } = req.body; // Datos necesarios para registrar el hechizo
    if (!name || !type || !description || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO spells (name, type, description, value) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [name, type, description, value]);

    res.status(201).json({
      message: "Spell added successfully",
      data: { id: result.insertId, name, type, description, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding spell", details: error.message });
  }
};

// Actualizar un hechizo por ID
export const updateSpells = async (req, res) => {
  try {
    const { name, type, description, value } = req.body; // Datos necesarios para actualizar
    if (!name || !type || !description || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE spells SET name=?, type=?, description=?, value=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [name, type, description, value, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Spell not found" });

    res.status(200).json({
      message: "Spell updated successfully",
      data: { name, type, description, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating spell", details: error.message });
  }
};

// Eliminar un hechizo por ID
export const deleteSpells = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM spells WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Spell not found" });

    res.status(200).json({
      message: "Spell deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting spell", details: error.message });
  }
};