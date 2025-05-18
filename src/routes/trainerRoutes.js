import { Router } from 'express';
import { getTrainers, getTrainer, createTrainerController, updateTrainerController, deleteTrainerController } from '../controllers/trainerController.js';
import multer from 'multer';
import path from 'path';

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/app/assets/img'); // carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const router = Router();

router.get('/', getTrainers);
router.get('/:id', getTrainer);
router.post('/', upload.single('photo'), createTrainerController);
router.put('/:id', upload.single('photo'), updateTrainerController);
router.delete('/:id', deleteTrainerController);

export default router;
