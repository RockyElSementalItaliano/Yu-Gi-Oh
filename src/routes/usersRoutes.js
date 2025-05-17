import express from 'express';
import { showUsers, showUserId, addUsers, updateUsers, deleteUsers } from '../controllers/usersController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authRole.js';

const router = express.Router();

// Ruta para mostrar todos los usuarios - solo admin
router.get('/', verifyToken, authorizeRoles('admin'), showUsers);

// Ruta para mostrar un usuario por ID - solo admin
router.get('/:id', verifyToken, authorizeRoles('admin'), showUserId);

// Ruta para registrar un nuevo usuario - abierto para todos
router.post('/', addUsers);

// Ruta para actualizar un usuario existente - solo admin
router.put('/:id', verifyToken, authorizeRoles('admin'), updateUsers);

// Ruta para eliminar un usuario por ID - solo admin
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUsers);

export default router;
