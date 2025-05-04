import { connect } from '../config/db/connect.js'; // Pool de conexión con la base de datos
import { determineWinner } from '../services/fightServices.js'; // Lógica para determinar el ganador

// Mostrar todos los partidos
export const showMatches = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches"; // Selecciona todos los partidos
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los partidos
  } catch (error) {
    res.status(500).json({ error: "Error fetching matches", details: error.message });
  }
};

// Mostrar un partido por ID
export const showMatchesId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches WHERE id = ?"; // Selecciona un partido específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Matches not found" });
    res.status(200).json(result[0]); // Devuelve el partido encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching matches", details: error.message });
  }
};

// Registrar un nuevo partido
export const addMatches = async (req, res) => {
  try {
    const { player1_id, player2_id, status } = req.body; // Datos necesarios para registrar un partido
    if (!player1_id || !player2_id || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO matches (player1_id, player2_id, status, created_at) 
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await connect.query(sqlQuery, [player1_id, player2_id, status]);

    res.status(201).json({
      message: "Matches added successfully",
      data: { id: result.insertId, player1_id, player2_id, status, created_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding matches", details: error.message });
  }
};

// Actualizar un partido por ID

export const updateMatches = async (req, res) => {
  try {
    const { id: matchId } = req.params;
    const { status } = req.body; // Recibimos el nuevo estado de la partida
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // Consultar los jugadores relacionados con el partido
    const sqlQuery = `
      SELECT player1_id, player2_id 
      FROM matches 
      WHERE id = ?
    `;
    const [matchData] = await connect.query(sqlQuery, [matchId]);
    if (!matchData) {
      return res.status(404).json({ error: "Match not found" });
    }

    const { player1_id, player2_id } = matchData;

    // Determinar el ganador usando el servicio
    const { winner, reason } = determineWinner(
      { name: 'Player 1', warrior: { power: player1_id } }, // Simulación de datos
      { name: 'Player 2', warrior: { power: player2_id } }  // Simulación de datos
    );

    // Actualizar la tabla de `matches` con el ganador y el motivo
    const updateQuery = `
      UPDATE matches 
      SET status = ?, winner_id = ?, reason_for_win = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    const [result] = await connect.query(updateQuery, [status, winner, reason, matchId]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Match not found" });

    res.status(200).json({
      message: "Match updated successfully",
      data: { matchId, status, winner, reason }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating match", details: error.message });
  }
};

// Eliminar un partido por ID
export const deleteMatches = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM matches WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Matches not found" });

    res.status(200).json({
      message: "Matches deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting matches", details: error.message });
  }
};