import express from 'express';
import { showFight, showFightId, addFight, updateFight, deleteFight, calculateWinner } from '../controllers/fightController.js';

const router = express.Router();

// Ruta para mostrar todos los combates
router.get('/', showFight);

// Ruta para mostrar un combate por ID
router.get('/:id', showFightId);

// Ruta para registrar un nuevo combate
router.post('/', addFight);

// Nueva ruta para calcular ganador basado en power y spell
router.post('/winner', calculateWinner);

// Ruta para actualizar un combate existente
router.put('/:id', updateFight);

// Ruta para eliminar un combate por ID
router.delete('/:id', deleteFight);

export default router;
