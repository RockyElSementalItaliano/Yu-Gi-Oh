import connect from '../config/db.js'; // Pool de conexión con la base de datos

// Crear una nueva partida
export const createMatch = async (player1_id, player2_id) => {
  try {
    const query = 'INSERT INTO matches (player1_id, player2_id, status) VALUES (?, ?, ?)';
    const [result] = await connect.query(query, [player1_id, player2_id, 'waiting']);
    return result; // Retorna información de la partida creada
  } catch (error) {
    throw new Error('Error creando partida: ' + error.message);
  }
};

// Obtener partida por ID
export const getMatchById = async (id) => {
  try {
    const query = 'SELECT * FROM matches WHERE id = ?';
    const [rows] = await connect.query(query, [id]);
    return rows[0]; // Retorna la partida encontrada
  } catch (error) {
    throw new Error('Error obteniendo partida: ' + error.message);
  }
};
//finalizar partida, actualizando el estado y el ganador
export const updateMatch = async (id, winner_id, reason_for_win) => {
    const query = `
      UPDATE matches 
      SET status = 'finished', winner_id = ?, reason_for_win = ?, updated_at = NOW()
      WHERE id = ?
    `;
    const [result] = await connect.query(query, [winner_id, reason_for_win, id]);
    return { message: 'Partida actualizada correctamente.', affectedRows: result.affectedRows };
  };

  //Recupera un historial de todas las partidas, incluyendo los nombres de los jugadores y el ganador
  export const getAllMatches = async () => {
    const query = `
      SELECT m.*, u1.username AS player1_name, u2.username AS player2_name, u3.username AS winner_name
      FROM matches m
      JOIN users u1 ON m.player1_id = u1.id
      JOIN users u2 ON m.player2_id = u2.id
      LEFT JOIN users u3 ON m.winner_id = u3.id
      ORDER BY m.created_at DESC
    `;
    const [rows] = await connect.query(query);
    return rows;
  };