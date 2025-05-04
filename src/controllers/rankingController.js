import { connect } from '../config/db/connect.js';

// Mostrar el ranking completo
export const showRanking = async (req, res) => {
  try {
    const sqlQuery = `SELECT r.*, u.username FROM ranking JOIN users u ON r.user_id = u.id 
      ORDER BY wins DESC, draws DESC, losses AS`; // Ordena el ranking por victorias y empates
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve el ranking
  } catch (error) {
    res.status(500).json({ error: "Error fetching rankings", details: error.message });
  }
};

// Mostrar el ranking de un jugador por ID
export const showRankingId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT r.*, u.username 
      FROM ranking r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `; // Muestra el ranking específico con detalles de usuario
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Ranking not found" });
    res.status(200).json(result[0]); // Devuelve el ranking encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching ranking", details: error.message });
  }
};

// Agregar un nuevo registro al ranking
export const addRanking = async (req, res) => {
  try {
    const { user_id, wins, losses, draws } = req.body; // Datos necesarios para registrar
    if (!user_id || wins === undefined || losses === undefined || draws === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO ranking (user_id, wins, losses, draws) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user_id, wins, losses, draws]);

    res.status(201).json({
      message: "Ranking added successfully",
      data: { id: result.insertId, user_id, wins, losses, draws }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding ranking", details: error.message });
  }
};

// Actualizar un registro de ranking por ID
export const updateRanking = async (req, res) => {
  try {
    const { wins, losses, draws } = req.body; // Datos necesarios para actualizar
    if (wins === undefined || losses === undefined || draws === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE ranking SET wins=?, losses=?, draws=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [wins, losses, draws, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ranking not found" });

    res.status(200).json({
      message: "Ranking updated successfully",
      data: { wins, losses, draws }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating ranking", details: error.message });
  }
};

// Eliminar un registro de ranking por ID
export const deleteRanking = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM ranking WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ranking not found" });

    res.status(200).json({
      message: "Ranking deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ranking", details: error.message });
  }
};