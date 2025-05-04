import { connect } from '../config/db/connect.js'; // Importación de la conexión a la base de datos

// Función para insertar múltiples selecciones (máximo 5 cartas)
export const createMultipleSelection = async (user_id, warrior_id) => {
  if (warrior_id.length > 5) {
    throw new Error('Cada jugador solo puede seleccionar hasta 5 cartas.');
  }

  const query = 'INSERT INTO player_selection (user_id, warrior_id) VALUES (?, ?)';
  const promises = warrior_id.map(warrior_id => connect.query(query, [user_id, warrior_id]));

  // Ejecutar todas las inserciones de forma concurrente
  await Promise.all(promises);
  return { message: 'Selecciones guardadas correctamente.' };
};

// Función para obtener las selecciones de un jugador con detalle enriquecido
export const getUserSelection = async (user_id) => {
  const [rows] = await connect.query(
    `SELECT ps.*, w.name AS warrior_name, p.name AS power, s.name AS spell
     FROM player_selection ps
     LEFT JOIN warriors w ON ps.warrior_id = w.id
     LEFT JOIN power p ON w.power_id = p.id
     LEFT JOIN spells s ON w.spell_id = s.id
     WHERE ps.user_id = ?`,
    [user_id]
  );
  return rows; // Retorna las 5 selecciones del jugador (o menos, dependiendo de la configuración)
};

// Función para eliminar selecciones previas (opcional, si se permite reelección)
export const deleteUserSelection = async (user_id) => {
  const query = 'DELETE FROM player_selection WHERE user_id = ?';
  const [result] = await connect.query(query, [user_id]);
  return result; // Retorna información sobre las filas eliminadas
};

// Exportación por defecto
export default { createMultipleSelection, getUserSelection, deleteUserSelection };