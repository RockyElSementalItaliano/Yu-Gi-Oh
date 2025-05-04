import { connect } from '../config/db/connect.js';

// Mostrar todos los juegos
export const showGame = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM game"; // Selecciona todos los juegos
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los juegos
  } catch (error) {
    res.status(500).json({ error: "Error fetching game", details: error.message });
  }
};

// Mostrar un juego por ID
export const showGameId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM game WHERE id = ?"; // Selecciona un juego específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Game not found" });
    res.status(200).json(result[0]); // Devuelve el juego encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching game", details: error.message });
  }
};

// Crear un nuevo juego
export const addGame = async (req, res) => {
  try {
    const { player1, player2, status } = req.body; // Datos necesarios para crear el juego
    if (!player1 || !player2 || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO game (player1, player2, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
    const [result] = await connect.query(sqlQuery, [player1, player2, status]);

    res.status(201).json({
      message: "Game added successfully",
      data: { id: result.insertId, player1, player2, status, created_at: new Date(), updated_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding game", details: error.message });
  }
};

// Actualizar un juego por ID
export const updateGame = async (req, res) => {
  try {
    const { status, winner } = req.body; // Datos necesarios para actualizar
    if (!status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE game SET status=?, winner=?, updated_at=NOW() WHERE id=?";
    const [result] = await connect.query(sqlQuery, [status, winner, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Game not found" });

    res.status(200).json({
      message: "Game updated successfully",
      data: { status, winner, updated_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating game", details: error.message });
  }
};

// Eliminar un juego por ID
export const deleteGame = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM game WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Game not found" });

    res.status(200).json({
      message: "Game deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting game", details: error.message });
  }
};