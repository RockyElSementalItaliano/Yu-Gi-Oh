import jwt from 'jsonwebtoken';
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword} from '../library/appBcrypt.js';

// Registro de un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = 'player'; // Forzar rol player al registrar

    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios.' });
    }

    const CHECK_USER_QUERY = 'SELECT * FROM users WHERE username = ?';
    const [existingUser] = await connect.query(CHECK_USER_QUERY, [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
    }

    const hashedPassword = await encryptPassword(password);

    const INSERT_USER_QUERY = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const [result] = await connect.query(INSERT_USER_QUERY, [username, hashedPassword, role]);

    const token = jwt.sign(
      { id: result.insertId, username, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      data: { id: result.insertId, username, role, token },
    });
  } catch (error) {
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

    console.log('Credenciales recibidas:', username, password);

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const sqlQuery = "SELECT * FROM users WHERE username = ?";
    const [result] = await connect.query(sqlQuery, [username]);

    console.log('Resultado consulta usuario:', result);

    if (result.length === 0) {
      console.log('Usuario no encontrado:', username);
      return res.status(401).json({ error: "User not found" });
    }

    const user = result[0];

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const allowedRoles = ['admin', 'player'];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Rol de usuario no permitido" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login", details: error.message });
  }
};

// Endpoint de prueba para verificar existencia de usuario
export const checkUserExists = async (req, res) => {
  try {
    const { username } = req.params;
    const sqlQuery = "SELECT * FROM users WHERE username = ?";
    const [result] = await connect.query(sqlQuery, [username]);

    if (result.length === 0) {
      return res.status(404).json({ exists: false, message: "Usuario no encontrado" });
    }

    res.json({ exists: true, user: result[0] });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Error checking user existence", details: error.message });
  }
};
