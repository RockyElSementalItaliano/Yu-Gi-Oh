import { Router } from 'express';
import { getTrainers } from '../controllers/trainerController.js';

const router = Router();

router.get('/', getTrainers);

export default router;
