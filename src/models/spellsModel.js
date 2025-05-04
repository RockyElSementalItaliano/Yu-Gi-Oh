import { connect } from '../config/db/connect.js'; // Importación del conector de la base de datos

export const getAll = async () => {
  const [rows] = await connect.query('SELECT * FROM spells'); // Consulta para obtener todos los hechizos
  return rows;
};

// Exportación por defecto (opcional)
export default { getAll };