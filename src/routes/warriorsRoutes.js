// src/app/routes/warriorRoutes.js
import express from 'express';
const router = express.Router();
import * as warriorController from '../controllers/warriorsController.js';

// Obtener todos los guerreros
router.get('/', warriorController.getAllWarriors);

// Nuevo endpoint para obtener un guerrero por ID
router.get('/:id', warriorController.getWarriorById);

export default router;
