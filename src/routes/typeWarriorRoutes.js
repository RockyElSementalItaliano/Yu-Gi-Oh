import express from 'express';
import { showTypeWarriors } from '../controllers/typeWarriorController.js';

const router = express.Router();

// Ruta para obtener todos los tipos de guerreros
router.get('/', showTypeWarriors);

export default router;
