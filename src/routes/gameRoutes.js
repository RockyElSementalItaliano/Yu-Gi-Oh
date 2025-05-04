import express from 'express';
import { showGame, showGameId, addGame, updateGame, deleteGame } from '../controllers/gameController.js';

const router = express.Router();

// Ruta para mostrar todos los juegos
router.get('/', showGame);

// Ruta para mostrar un juego por ID
router.get('/:id', showGameId);

// Ruta para registrar un nuevo juego
router.post('/', addGame);

// Ruta para actualizar un juego existente
router.put('/:id', updateGame);

// Ruta para eliminar un juego por ID
router.delete('/:id', deleteGame);

export default router;