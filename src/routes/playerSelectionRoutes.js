import express from 'express';
import { showPlayerSelection, showPlayerSelectionId, addPlayerSelection, updatePlayerSelection, deletePlayerSelection } from '../controllers/playerSelectionController.js';

const router = express.Router();

// Ruta para mostrar todas las selecciones de jugadores
router.get('/', showPlayerSelection);

// Ruta para mostrar una selección de jugador por ID
router.get('/:id', showPlayerSelectionId);

// Ruta para registrar una nueva selección de jugador
router.post('/', addPlayerSelection);

// Ruta para actualizar una selección de jugador existente
router.put('/:id', updatePlayerSelection);

// Ruta para eliminar una selección de jugador por ID
router.delete('/:id', deletePlayerSelection);

export default router;