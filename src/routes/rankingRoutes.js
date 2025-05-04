import express from 'express';
import { showRanking, showRankingId, addRanking, updateRanking, deleteRanking } from '../controllers/rankingController.js';

const router = express.Router();

// Ruta para mostrar el ranking completo
router.get('/', showRanking);

// Ruta para mostrar el ranking de un jugador por ID
router.get('/:id', showRankingId);

// Ruta para registrar un nuevo jugador en el ranking
router.post('/', addRanking);

// Ruta para actualizar un registro de ranking existente
router.put('/:id', updateRanking);

// Ruta para eliminar un registro de ranking por ID
router.delete('/:id', deleteRanking);

export default router;