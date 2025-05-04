import jwt from 'jsonwebtoken';
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword} from '../library/appBcrypt.js';
// Registro de un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación de campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    const CHECK_USER_QUERY = 'SELECT * FROM users WHERE username = ?';
    const [existingUser] = await connect.query(CHECK_USER_QUERY, [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await encryptPassword(password);

    // Insertar el nuevo usuario
    const INSERT_USER_QUERY = 'INSERT INTO users (username, password) VALUES (?, ?, NOW())';
    const [result] = await connect.query(INSERT_USER_QUERY, [username, hashedPassword]);

    // Generar token JWT para el nuevo usuario
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS256' } // Asegúrate de que el algoritmo sea compatible con tu configuración
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      data: { id: result.insertId, username, token },
    });
  } catch (error) {
    // Manejo de errores
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
    }
    res.status(500).json({ error: 'Error registrando usuario.', details: error.message });
  }
};

// Inicio de sesión de un usuario existente
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    let sqlQuery = "SELECT * FROM users WHERE username = ?";
    const [result] = await connect.query(sqlQuery, [username]);

    // Verificar si el usuario existe
    if (result.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result[0];
    console.log("User found:", user); // Depuración para validar datos del usuario.

    // Verificación de contraseña
    const validPassword = await comparePassword(password, user.password); // Asegúrate de usar bcrypt aquí.
    if (!validPassword) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error); // Depuración para errores internos
    res.status(500).json({ error: "Error during login", details: error.message });
  }
};