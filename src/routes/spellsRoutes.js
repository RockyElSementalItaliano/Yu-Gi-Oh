import express from 'express';
import { showSpells, showSpellsId, addSpells, updateSpells, deleteSpells } from '../controllers/spellsController.js';

const router = express.Router();

// Ruta para mostrar todos los hechizos
router.get('/', showSpells);

// Ruta para mostrar un hechizo por ID
router.get('/:id', showSpellsId);

// Ruta para registrar un nuevo hechizo
router.post('/', addSpells);

// Ruta para actualizar un hechizo existente
router.put('/:id', updateSpells);

// Ruta para eliminar un hechizo por ID
router.delete('/:id', deleteSpells);

export default router;