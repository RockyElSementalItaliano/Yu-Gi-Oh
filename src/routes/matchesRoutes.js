import express from 'express';
import { showMatches, showMatchesId, addMatches, updateMatches, deleteMatches } from '../controllers/matchesController.js';

const router = express.Router();

// Ruta para mostrar todos los partidos
router.get('/', showMatches);

// Ruta para mostrar un partido por ID
router.get('/:id', showMatchesId);

// Ruta para registrar un nuevo partido
router.post('/', addMatches);

// Ruta para actualizar un partido existente
router.put('/:id', updateMatches);

// Ruta para eliminar un partido por ID
router.delete('/:id', deleteMatches);

export default router;