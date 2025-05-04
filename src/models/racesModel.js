import { connect } from '../config/db/connect.js'; // Importación de la conexión a la base de datos

export const getAll = async () => {
  const [rows] = await connect.query('SELECT * FROM races'); // Consulta para obtener todas las razas
  return rows;
};

// Exportación por defecto (opcional)
export default { getAll };