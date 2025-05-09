import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig.js';
import { addCard, showCards, showCardId, updateCard, deleteCard } from '../controllers/cardsController.js';

const router = Router();
const upload = multer(multerConfig);

// Rutas para cartas
router.get('/', showCards);
router.get('/:id', showCardId);
router.post('/', upload.array('image_url'), addCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;
