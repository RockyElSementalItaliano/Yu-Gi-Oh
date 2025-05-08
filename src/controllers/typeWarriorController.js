import { connect } from '../config/db/connect.js';

// Mostrar todos los tipos de guerreros
export const showTypeWarriors = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM type_warriors"; // Selecciona todos los tipos de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los tipos de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error fetching type warriors", details: error.message });
  }
};

// Mostrar un tipo de guerrero por ID
export const showTypeWarriorsId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM type_warriors WHERE id = ?"; // Selecciona un tipo específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Type warrior not found" });
    res.status(200).json(result[0]); // Devuelve el tipo encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching type warrior", details: error.message });
  }
};

// Registrar un nuevo tipo de guerrero
export const addTypeWarriors = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para registrar el tipo
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO type_warriors (name, description) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [name, description]);

    res.status(201).json({
      message: "Type warrior added successfully",
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding type warrior", details: error.message });
  }
};

// Actualizar un tipo de guerrero por ID
export const updateTypeWarriors = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para actualizar
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE type_warriors SET name=?, description=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [name, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Type warrior not found" });

    res.status(200).json({
      message: "Type warrior updated successfully",
      data: { name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating type warrior", details: error.message });
  }
};

// Eliminar un tipo de guerrero por ID
export const deleteTypeWarriors = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM type_warriors WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Type warrior not found" });

    res.status(200).json({
      message: "Type warrior deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting type warrior", details: error.message });
  }
};
