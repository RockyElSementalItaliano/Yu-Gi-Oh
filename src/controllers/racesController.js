import { connect } from '../config/db/connect.js';

// Mostrar todas las razas
export const showRaces = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM races"; // Selecciona todas las razas
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las razas
  } catch (error) {
    res.status(500).json({ error: "Error fetching races", details: error.message });
  }
};

// Mostrar una raza por ID
export const showRacesId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM races WHERE id = ?"; // Selecciona una raza específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Race not found" });
    res.status(200).json(result[0]); // Devuelve la raza encontrada
  } catch (error) {
    res.status(500).json({ error: "Error fetching race", details: error.message });
  }
};

// Registrar una nueva raza
export const addRaces = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para registrar la raza
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO races (name, description) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [name, description]);

    res.status(201).json({
      message: "Race added successfully",
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding race", details: error.message });
  }
};

// Actualizar una raza por ID
export const updateRaces = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para actualizar
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE races SET name=?, description=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [name, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Race not found" });

    res.status(200).json({
      message: "Race updated successfully",
      data: { name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating race", details: error.message });
  }
};

// Eliminar una raza por ID
export const deleteRaces = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM races WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Race not found" });

    res.status(200).json({
      message: "Race deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting race", details: error.message });
  }
};