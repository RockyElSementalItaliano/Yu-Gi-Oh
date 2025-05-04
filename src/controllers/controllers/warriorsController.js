import { connect } from '../config/db/connect.js';

// Obtener un guerrero específico por ID
export const getWarriorById = async (req, res) => {
    try {
        const warriorId = req.params.id;
        
        // Consulta para MySQL
        const [warrior] = await connect.query(
            'SELECT * FROM warriors WHERE id = ? LIMIT 1', 
            [warriorId]
        );

        if (!warrior.length) {
            return res.status(404).json({ 
                error: 'Guerrero no encontrado' 
            });
        }

        res.json(warrior[0]);
        
    } catch (error) {
        console.error('Error al buscar guerrero:', error);
        res.status(500).json({ 
            error: 'Error en el servidor',
            details: error.message 
        });
    }
};

// Obtener todos los guerreros
export const getAllWarriors = async (req, res) => {
    try {
        // Consulta para MySQL
        const [warriors] = await connect.query('SELECT * FROM warriors');
        res.json(warriors);
    } catch (error) {
        console.error('Error al obtener guerreros:', error);
        res.status(500).json({
            error: 'Error en el servidor',
            details: error.message
        });
    }
};
