import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser } from '../models/usersModel.js'; // Importar funciones del modelo
import jwt from 'jsonwebtoken'; // Para generar el token JWT
import { encryptPassword, comparePassword } from '../library/appBcrypt.js'; // Encriptar contraseñas

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      // Encriptar la contraseña antes de guardar en la base de datos
      const hashedPassword = await encryptPassword(password);

      // Registrar al usuario utilizando el modelo
      const user = await registerUser (username, hashedPassword);

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (err) {
      res.status(500).json({
        error: 'Registration failed',
        details: err.message,
      });
    }
  }
);

// Ruta para iniciar sesión
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      console.log('Credenciales recibidas:', username, password );

      // Buscar al usuario en la base de datos
      const User = await loginUser (username, password);
      if (!User) {
        console.log('Usuario no encontrado:', username);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Comparar la contraseña ingresada con la almacenada
      const passwordIsValid = await comparePassword(password, User.password);
      console.log('Contraseña válida:', passwordIsValid);
      // Si la contraseña no es válida, retornar error
      if (!passwordIsValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generar un token JWT para el usuario
      const token = jwt.sign(
        { id: User.id, username: User.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        User,
      });
    } catch (err) {
      res.status(500).json({
        error: 'Login failed',
        details: err.message,
      });
    }
  }
);

export default router; // Exportación ES6