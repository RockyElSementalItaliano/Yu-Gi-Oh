import connect from '../config/db.js'; // Pool de conexión con la base de datos

// Obtener guerrero por ID
export const getWarriorById = async (id) => {
  try {
    const query = 'SELECT * FROM warriors WHERE id = ?';
    const [rows] = await connect.query(query, [id]);
    return rows[0]; // Retorna el guerrero encontrado
  } catch (error) {
    throw new Error('Error obteniendo guerrero: ' + error.message);
  }
};

// Obtener todos los guerreros
export const getAllWarriors = async () => {
  try {
    const query = 'SELECT * FROM warriors';
    const [rows] = await connect.query(query);
    return rows; // Retorna todos los guerreros
  } catch (error) {
    throw new Error('Error obteniendo lista de guerreros: ' + error.message);
  }
};