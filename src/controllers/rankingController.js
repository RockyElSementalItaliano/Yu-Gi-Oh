import { connect } from '../config/db/connect.js';
import { getAllTrainers } from '../models/trainerModel.js';

// Mostrar el ranking completo
export const showRanking = async (req, res) => {
  try {
    const sqlQuery = `SELECT r.*, t.name AS trainer_name FROM ranking r JOIN trainer t ON r.trainer_id = t.id 
      ORDER BY wins DESC, draws DESC, losses ASC`; // Ordena el ranking por victorias, empates y derrotas
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve el ranking
  } catch (error) {
    res.status(500).json({ error: "Error fetching rankings", details: error.message });
  }
};

// Mostrar el ranking de un entrenador por ID
export const showRankingId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT r.*, t.name AS trainer_name 
      FROM ranking r 
      JOIN trainer t ON r.trainer_id = t.id 
      WHERE r.id = ?
    `; // Muestra el ranking específico con detalles de entrenador
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
    const { trainer_id, wins, losses, draws } = req.body; // Datos necesarios para registrar
    if (!trainer_id || wins === undefined || losses === undefined || draws === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO ranking (trainer_id, wins, losses, draws) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [trainer_id, wins, losses, draws]);

    res.status(201).json({
      message: "Ranking added successfully",
      data: { id: result.insertId, trainer_id, wins, losses, draws }
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

// Inicializar ranking con entrenadores existentes
export const initializeRanking = async (req, res) => {
  try {
    const trainers = await getAllTrainers();

    for (const trainer of trainers) {
      // Insertar solo si no existe ya un registro para ese entrenador
      const [existing] = await connect.query('SELECT * FROM ranking WHERE trainer_id = ?', [trainer.id]);
      if (existing.length === 0) {
        await connect.query(
          'INSERT INTO ranking (trainer_id, wins, losses, draws) VALUES (?, 0, 0, 0)',
          [trainer.id]
        );
      }
    }

    res.status(200).json({ message: 'Ranking inicializado con entrenadores existentes' });
  } catch (error) {
    res.status(500).json({ error: 'Error inicializando ranking', details: error.message });
  }
};
