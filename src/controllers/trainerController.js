import { getAllTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer } from '../models/trainerModel.js';
import { deleteRankingByTrainerId } from '../models/rankingModels.js';
import path from 'path';
import fs from 'fs';

export const getTrainers = async (req, res) => {
  try {
    const trainers = await getAllTrainers();
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Error al obtener entrenadores' });
  }
};

export const getTrainer = async (req, res) => {
  try {
    const trainer = await getTrainerById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ message: 'Error al obtener entrenador' });
  }
};

export const createTrainerController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: 'Nombre y fotografía son requeridos' });
    }
    const imageUrl = `/img/${req.file.filename}`;
    const result = await createTrainer(name, imageUrl);
    res.status(201).json({ message: 'Entrenador creado', id: result.insertId });
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: 'Error al crear entrenador' });
  }
};

export const updateTrainerController = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/img/${req.file.filename}`;
    } else {
      // Obtener entrenador actual para mantener imagen si no se actualiza
      const trainer = await getTrainerById(id);
      if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });
      imageUrl = trainer.image;
    }

    const result = await updateTrainer(id, name, imageUrl);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Entrenador no encontrado' });

    res.json({ message: 'Entrenador actualizado' });
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ message: 'Error al actualizar entrenador' });
  }
};

export const deleteTrainerController = async (req, res) => {
  try {
    const id = req.params.id;
    const trainer = await getTrainerById(id);
    if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });

    // Eliminar registros relacionados en ranking
    await deleteRankingByTrainerId(id);

    // Eliminar archivo de imagen si existe
    if (trainer.image) {
      const imagePath = path.join(process.cwd(), 'public', trainer.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen del entrenador:', err);
          // No retornar error para que la eliminación del entrenador continúe
        }
      });
    }

    const result = await deleteTrainer(id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Entrenador no encontrado' });
    res.json({ message: 'Entrenador eliminado' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Error al eliminar entrenador' });
  }
};
