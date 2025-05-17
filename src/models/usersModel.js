import { connect } from '../config/db/connect.js'; // Importación de la conexión

export const registerUser = async (username, password, role = 'player') => {
  const [result] = await connect.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role]
  );
  return result;
};

export const loginUser = async (username) => {
  const [rows] = await connect.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
};

// Exportación por defecto (si quieres usarla como objeto)
export default { registerUser, loginUser };
