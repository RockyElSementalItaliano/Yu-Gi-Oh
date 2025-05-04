import { connect } from '../config/db/connect.js'; // Importación de la conexión a la base de datos

export const getAll = async () => {
  const [rows] = await connect.query('SELECT * FROM power'); // Consulta para obtener todos los registros de la tabla "power"
  return rows;
};

// Exportación por defecto (opcional)
export default { getAll };