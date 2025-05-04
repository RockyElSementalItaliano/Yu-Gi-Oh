import { connect } from '../../config/db/connect.js'; // Importación del conector de la base de datos

export const getRanking = async () => {
  const [rows] = await connect.query(`
    SELECT 
      u.username, 
      w.name AS warrior, 
      p.name AS power, 
      s.name AS spell,
      (p.effect + s.effect) AS total_power
    FROM player_selection ps
    JOIN users u ON ps.user_id = u.id
    JOIN warriors w ON ps.warrior_id = w.id
    JOIN power p ON w.power_id = p.id
    JOIN spells s ON w.spell_id = s.id
    ORDER BY total_power DESC
  `);

  return rows;
};

// Exportación por defecto (opcional)
export default { getRanking };