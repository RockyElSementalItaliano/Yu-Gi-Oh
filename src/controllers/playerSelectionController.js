import { connect } from '../config/db/connect.js';

// Mostrar todas las selecciones de jugadores
export const showPlayerSelection = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM playerselection"; // Selecciona todas las selecciones
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las selecciones
  } catch (error) {
    res.status(500).json({ error: "Error fetching player selections", details: error.message });
  }
};

// Mostrar una selección de jugador por ID
export const showPlayerSelectionId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM playerselection WHERE id = ?"; // Selecciona una selección específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Player selection not found" });
    res.status(200).json(result[0]); // Devuelve la selección encontrada
  } catch (error) {
    res.status(500).json({ error: "Error fetching player selection", details: error.message });
  }
};

// Registrar una nueva selección de jugador
export const addPlayerSelection = async (req, res) => {
  try {
    const { game_id, player_id, card_id } = req.body; // Datos necesarios para registrar la selección
    if (!game_id || !player_id || !card_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO playerselection (game_id, player_id, card_id, selected_at) 
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await connect.query(sqlQuery, [game_id, player_id, card_id]);

    res.status(201).json({
      message: "Player selection added successfully",
      data: { id: result.insertId, game_id, player_id, card_id, selected_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding player selection", details: error.message });
  }
};

// Actualizar una selección de jugador por ID
export const updatePlayerSelection = async (req, res) => {
  try {
    const { game_id, player_id, card_id } = req.body; // Datos necesarios para actualizar
    if (!game_id || !player_id || !card_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `UPDATE playerselection SET game_id=?, player_id=?, card_id=?, selected_at=NOW() WHERE id=?`;
    const [result] = await connect.query(sqlQuery, [game_id, player_id, card_id, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Player selection not found" });

    res.status(200).json({
      message: "Player selection updated successfully",
      data: { game_id, player_id, card_id, selected_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating player selection", details: error.message });
  }
};

// Eliminar una selección de jugador por ID
export const deletePlayerSelection = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM playerselection WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Player selection not found" });

    res.status(200).json({
      message: "Player selection deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting player selection", details: error.message });
  }
};