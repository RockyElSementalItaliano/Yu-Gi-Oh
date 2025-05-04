import { connect } from '../config/db/connect.js'; // Importación de la conexión

export const registerUser = async (username, password) => {
  const [result] = await connect.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
  return result;
};

export const loginUser = async (username, password) => {
  const [rows] = await connect.query(
    'SELECT * FROM users WHERE username = ?',
    [username, password]
  );
  return rows[0];
};

// Exportación por defecto (si quieres usarla como objeto)
export default { registerUser, loginUser };