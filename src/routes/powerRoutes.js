import express from 'express';
import { showPower, showPowerId, addPower, updatePower, deletePower } from '../controllers/powerController.js';

const router = express.Router();

// Ruta para mostrar todos los poderes
router.get('/', showPower);

// Ruta para mostrar un poder por ID
router.get('/:id', showPowerId);

// Ruta para registrar un nuevo poder
router.post('/', addPower);

// Ruta para actualizar un poder existente
router.put('/:id', updatePower);

// Ruta para eliminar un poder por ID
router.delete('/:id', deletePower);

export default router;