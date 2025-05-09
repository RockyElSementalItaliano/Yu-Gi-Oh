import { connect } from '../config/db/connect.js';

// Mostrar todas las tarjetas
export const showCards = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM warriors"; // Selecciona todas las tarjetas
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las tarjetas
  } catch (error) {
    res.status(500).json({ error: "Error fetching cards", details: error.message });
  }
};

// Mostrar una tarjeta por ID
export const showCardId = async (req, res) => {
  try {
    const sqlQuery = 'SELECT * FROM warriors WHERE id = ?'; // Selecciona una tarjeta específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Card not found" });
    res.status(200).json(result[0]); // Devuelve la tarjeta encontrada
  } catch (error) {
    res.status(500).json({ error: "Error fetching card", details: error.message });
  }
};

// Crear una nueva tarjeta
export const addCard = async (req, res) => {
  try {
    const { name, race_id, power_id, spell_id, description, type_warrior_id } = req.body;
    if (!name || !race_id || !power_id || !spell_id || !description || !type_warrior_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Buscar el archivo con campo 'image_url'
    const imageFile = req.files.find(file => file.fieldname === 'image_url');
    if (!imageFile) {
      return res.status(400).json({ error: "Image file with fieldname 'image_url' is required" });
    }

    console.log('Ruta imagen subida:', imageFile.path);
    const path = await import('path');
    const image_url = path.basename(imageFile.path); // Guardar solo el nombre del archivo

    const sqlQuery = "INSERT INTO warriors (name, race_id, power_id, spell_id, image_url, description, type_warrior_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [name, race_id, power_id, spell_id, image_url, description, type_warrior_id]);

    res.status(201).json({
      message: "Card added successfully",
      data: { id: result.insertId, name, race_id, power_id, spell_id, image_url, description, type_warrior_id }
    });
  } catch (error) {
    console.error('Error en addCard:', error);
    res.status(500).json({ error: "Error adding card", details: error.message });
  }
};

// Actualizar una tarjeta por ID
export const updateCard = async (req, res) => {
  try {
    const { warrior_id, description, image_url } = req.body; // Datos necesarios para actualizar
    if (!warrior_id || !description || !image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE warriors SET warrior_id=?, description=?, image_url=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [warrior_id, description, image_url, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Card not found" });

    res.status(200).json({
      message: "Card updated successfully",
      data: { warrior_id, description, image_url }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating card", details: error.message });
  }
};

// Eliminar una tarjeta por ID
export const deleteCard = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM warriors WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Card not found" });

    res.status(200).json({
      message: "Card deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting card", details: error.message });
  }
};
