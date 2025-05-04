const db = require('../config/db/connect.js');
const bcrypt = require('bcrypt');

module.exports = {
  // Función para registrar un usuario
  async register(username, password) {
    try {
      // Generar un hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el usuario en la base de datos con la contraseña encriptada
      const [result] = await db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );

      return {
        id: result.insertId,
        username,
        message: 'User registered successfully',
      };
    } catch (error) {
      // Manejar errores de registro
      throw new Error(`Error registering user: ${error.message}`);
    }
  },

  // Función para iniciar sesión
  async login(username, password) {
    try {
      // Buscar el usuario por nombre de usuario
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        // Usuario no encontrado
        throw new Error('Invalid username or password');
      }

      const user = rows[0];

      // Comparar la contraseña ingresada con la almacenada
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        // Contraseña incorrecta
        throw new Error('Invalid username or password');
      }

      // Retornar los datos del usuario si la autenticación es exitosa
      return {
        id: user.id,
        username: user.username,
        message: 'Login successful',
      };
    } catch (error) {
      // Manejar errores de inicio de sesión
      throw new Error(`Error logging in: ${error.message}`);
    }
  },
};