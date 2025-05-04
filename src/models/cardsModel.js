import connect from '../config/db/connect.js'; // Importación del conector de la base de datos

// Obtener todas las cartas
export const getAll = async () => {
  const [rows] = await connect.query('SELECT * FROM warriors');
  return rows;
};

// Obtener cartas por un conjunto de ID
export const getById = async (id) => {
  if (ids.length > 5) {
    throw new Error('El jugador no puede seleccionar más de 5 cartas.');
  }

  const placeholders = id.map(() => '?').join(',');
  const [rows] = await connect.query(
    `SELECT * FROM warriors WHERE id IN (${placeholders})`,
    ids
  );
  return rows;
};

// Guardar la selección de cartas de un jugador
export const savePlayerCard = async (player_id, game_id, card_id) => {
  if (card_id.length > 5) {
    throw new Error('El jugador no puede seleccionar más de 5 cartas.');
  }

  const query = 'INSERT INTO playerselection (game_id, player_id, card_id) VALUES (?, ?, ?)';
  const promises = card_id.map(card_id => connect.query(query, [game_id, player_id, card_id]));
  // Ejecutar todas las inserciones de forma concurrente

  await Promise.all(promises);
  return { message: 'Selecciones guardadas correctamente.' };
};

// Obtener cartas con filtros opcionales
export const getFilteredCard = async (filters) => {
  let query = 'SELECT * FROM warriors';
  const conditions = [];
  const values = [];

  if (filters.power) {
    conditions.push('power >= ?');
    values.push(filters.power);
  }
  if (filters.race) {
    conditions.push('race_id = ?');
    values.push(filters.race);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await connect.query(query, values);
  return rows;
};

// Exportación del modelo
export default { getAll, getById, savePlayerCard, getFilteredCard };