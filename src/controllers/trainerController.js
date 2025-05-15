import { getAllTrainers } from '../models/trainerModel.js';

export const getTrainers = async (req, res) => {
  try {
    const trainers = await getAllTrainers();
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Error al obtener entrenadores' });
  }
};
