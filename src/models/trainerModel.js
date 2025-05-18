import { connect } from '../config/db/connect.js';

// Función para obtener todos los entrenadores
export const getAllTrainers = async () => {
  const [rows] = await connect.query('SELECT * FROM trainer');
  return rows;
};

// Función para obtener un entrenador por id
export const getTrainerById = async (id) => {
  const [rows] = await connect.query('SELECT * FROM trainer WHERE id = ?', [id]);
  return rows[0];
};

// Función para crear un nuevo entrenador
export const createTrainer = async (name, image_url) => {
  const [result] = await connect.query(
    'INSERT INTO trainer (name, image) VALUES (?, ?)',
    [name, image_url]
  );
  return result;
};

export const updateTrainer = async (id, name, image_url) => {
  const [result] = await connect.query(
    'UPDATE trainer SET name = ?, image = ? WHERE id = ?',
    [name, image_url, id]
  );
  return result;
};

export const deleteTrainer = async (id) => {
  const [result] = await connect.query(
    'DELETE FROM trainer WHERE id = ?',
    [id]
  );
  return result;
};

export default { getAllTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer };
