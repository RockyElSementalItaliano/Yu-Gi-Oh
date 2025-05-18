import { connect } from '../config/db/connect.js';

// Mostrar todas las tarjetas con nombres legibles
export const showCards = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT w.*, r.name AS race_name, p.type AS power_type, p.value AS power_value, s.type AS spell_type, s.value AS spell_value, t.name AS type_warrior_name
      FROM warriors w
      LEFT JOIN races r ON w.race_id = r.id
      LEFT JOIN power p ON w.power_id = p.id
      LEFT JOIN spells s ON w.spell_id = s.id
      LEFT JOIN type_warriors t ON w.type_warrior_id = t.id
    `;
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: "Error fetching cards", details: error.message });
  }
};

// Mostrar una tarjeta por ID con nombres legibles
export const showCardId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT w.*, r.name AS race_name, p.type AS power_type, p.value AS power_value, s.type AS spell_type, s.value AS spell_value, t.name AS type_warrior_name
      FROM warriors w
      LEFT JOIN races r ON w.race_id = r.id
      LEFT JOIN power p ON w.power_id = p.id
      LEFT JOIN spells s ON w.spell_id = s.id
      LEFT JOIN type_warriors t ON w.type_warrior_id = t.id
      WHERE w.id = ?
    `;
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Card not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error fetching card:', error);
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

    const imageFile = req.files.find(file => file.fieldname === 'image_url');
    if (!imageFile) {
      return res.status(400).json({ error: "Image file with fieldname 'image_url' is required" });
    }

    const path = await import('path');
    const image_url = path.basename(imageFile.path);

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

// Actualizar una tarjeta por ID sin modificar la imagen
export const updateCard = async (req, res) => {
  try {
    // Usar directamente req.body, ignorando cualquier archivo de imagen
    const { name, race_id, power_id, spell_id, description, type_warrior_id } = req.body;

    if (!name || !race_id || !power_id || !spell_id || !description || !type_warrior_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE warriors SET name=?, race_id=?, power_id=?, spell_id=?, description=?, type_warrior_id=? WHERE id=?";
    const params = [name, race_id, power_id, spell_id, description, type_warrior_id, req.params.id];

    const [result] = await connect.query(sqlQuery, params);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Card not found" });

    res.status(200).json({
      message: "Card updated successfully",
      data: { id: req.params.id, name, race_id, power_id, spell_id, description, type_warrior_id }
    });
  } catch (error) {
    console.error('Error en updateCard:', error);
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
    console.error('Error en deleteCard:', error);
    res.status(500).json({ error: "Error deleting card", details: error.message });
  }
};
