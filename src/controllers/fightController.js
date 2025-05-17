import { connect } from '../config/db/connect.js';

// Mostrar todos los combates
export const showFight = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM fight"; // Selecciona todos los combates
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los combates
  } catch (error) {
    res.status(500).json({ error: "Error fetching fight", details: error.message });
  }
};

// Mostrar un combate por ID
export const showFightId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM fight WHERE id = ?"; // Selecciona un combate específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Fight not found" });
    res.status(200).json(result[0]); // Devuelve el combate encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching fight", details: error.message });
  }
};

// Registrar un nuevo combate
export const addFight = async (req, res) => {
  try {
    const { player1, player2, card1, card2, winner } = req.body; // Datos necesarios para registrar el combate
    if (!player1 || !player2 || !card1 || !card2 || !winner) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO fight (player1, player2, card1, card2, winner, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    const [result] = await connect.query(sqlQuery, [player1, player2, card1, card2, winner]);

    res.status(201).json({
      message: "Fight added successfully",
      data: { id: result.insertId, player1, player2, card1, card2, winner, created_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding fight", details: error.message });
  }
};

// Actualizar un combate por ID
export const updateFight = async (req, res) => {
  try {
    const { player1, player2, card1, card2, winner } = req.body; // Datos necesarios para actualizar
    if (!player1 || !player2 || !card1 || !card2 || !winner) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE fight SET player1=?, player2=?, card1=?, card2=?, winner=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [player1, player2, card1, card2, winner, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Fight not found" });

    res.status(200).json({
      message: "Fight updated successfully",
      data: { player1, player2, card1, card2, winner }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating fight", details: error.message });
  }
};

// Eliminar un combate por ID
export const deleteFight = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM fight WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Fight not found" });

    res.status(200).json({
      message: "Fight deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting fight", details: error.message });
  }
};

// Calcular ganador basado en suma de power y spell
export const calculateWinner = async (req, res) => {
  try {
    const { player1Warriors, player2Warriors, player1TrainerId, player2TrainerId } = req.body;

    if (!Array.isArray(player1Warriors) || !Array.isArray(player2Warriors)) {
      return res.status(400).json({ error: "player1Warriors y player2Warriors deben ser arrays de IDs" });
    }

    // Función para obtener suma de power + spell para un array de warrior IDs
    const getSumPowerSpell = async (warriorIds) => {
      if (warriorIds.length === 0) return 0;

      const placeholders = warriorIds.map(() => '?').join(',');
      const sql = `
        SELECT SUM(p.value + s.value) AS total
        FROM warriors w
        JOIN power p ON w.power_id = p.id
        JOIN spells s ON w.spell_id = s.id
        WHERE w.id IN (${placeholders})
      `;
      const [rows] = await connect.query(sql, warriorIds);
      return rows[0].total || 0;
    };

    const player1Total = await getSumPowerSpell(player1Warriors);
    const player2Total = await getSumPowerSpell(player2Warriors);

    let winner = null;
    if (player1Total > player2Total) winner = 'player1';
    else if (player2Total > player1Total) winner = 'player2';
    else winner = 'draw';

    // Función para insertar registro en ranking si no existe
    const insertRankingIfNotExists = async (trainerId) => {
      const [rows] = await connect.query('SELECT * FROM ranking WHERE trainer_id = ?', [trainerId]);
      if (rows.length === 0) {
        await connect.query('INSERT INTO ranking (trainer_id, wins, losses, draws) VALUES (?, 0, 0, 0)', [trainerId]);
      }
    };

    // Insertar registros si no existen
    await insertRankingIfNotExists(player1TrainerId);
    await insertRankingIfNotExists(player2TrainerId);

    // Actualizar ranking
    const updateRanking = async (trainerId, field) => {
      const sql = `UPDATE ranking SET ${field} = ${field} + 1 WHERE trainer_id = ?`;
      await connect.query(sql, [trainerId]);
    };

    if (winner === 'player1') {
      await updateRanking(player1TrainerId, 'wins');
      await updateRanking(player2TrainerId, 'losses');
    } else if (winner === 'player2') {
      await updateRanking(player2TrainerId, 'wins');
      await updateRanking(player1TrainerId, 'losses');
    } else {
      // Empate
      await updateRanking(player1TrainerId, 'draws');
      await updateRanking(player2TrainerId, 'draws');
    }

    res.status(200).json({
      player1Total,
      player2Total,
      winner
    });
  } catch (error) {
    res.status(500).json({ error: "Error calculating winner", details: error.message });
  }
};
