import express from 'express';
import { showCards, showCardId, addCard, updateCard, deleteCard } from '../controllers/cardsController.js';

const router = express.Router();

// Ruta para mostrar todos los combates
router.get('/', showCards);

// Ruta para mostrar un combate por ID
router.get('/:id', showCardId);

// Ruta para registrar un nuevo combate
router.post('/', addCard);

// Ruta para actualizar un combate existente
router.put('/:id', updateCard);

// Ruta para eliminar un combate por ID
router.delete('/:id', deleteCard);

export default router;