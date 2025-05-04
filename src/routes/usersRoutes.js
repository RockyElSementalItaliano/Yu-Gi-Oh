import express from 'express';
import { showUsers, showUserId, addUsers, updateUsers, deleteUsers } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Ruta para mostrar todos los usuarios
router.get('/', verifyToken, showUsers);

// Ruta para mostrar un usuario por ID
router.get('/:id', verifyToken, showUserId);

// Ruta para registrar un nuevo usuario
router.post('/', addUsers);

// Ruta para actualizar un usuario existente
router.put('/:id', verifyToken, updateUsers);

// Ruta para eliminar un usuario por ID
router.delete('/:id', verifyToken, deleteUsers);

export default router;