import express from 'express';
import { showRaces, showRacesId, addRaces, updateRaces, deleteRaces } from '../controllers/racesController.js';

const router = express.Router();

// Ruta para mostrar todos los poderes
router.get('/', showRaces);

// Ruta para mostrar un poder por ID
router.get('/:id', showRacesId);

// Ruta para registrar un nuevo poder
router.post('/', addRaces);

// Ruta para actualizar un poder existente
router.put('/:id', updateRaces);

// Ruta para eliminar un poder por ID
router.delete('/:id', deleteRaces);

export default router;