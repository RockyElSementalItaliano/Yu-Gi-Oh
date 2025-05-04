import { connect } from '../config/db/connect.js';

// Mostrar todas las tarjetas
export const showCards = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM cards"; // Selecciona todas las tarjetas
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las tarjetas
  } catch (error) {
    res.status(500).json({ error: "Error fetching cards", details: error.message });
  }
};

// Mostrar una tarjeta por ID
export const showCardId = async (req, res) => {
  try {
    const sqlQuery = 'SELECT * FROM cards WHERE id = ?'; // Selecciona una tarjeta específica
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
    const { warrior_id, description, image_url } = req.body; // Datos necesarios para crear la tarjeta
    if (!warrior_id || !description || !image_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO cards (warrior_id, description, image_url) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [warrior_id, description, image_url]);

    res.status(201).json({
      message: "Card added successfully",
      data: { id: result.insertId, warrior_id, description, image_url }
    });
  } catch (error) {
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

    const sqlQuery = "UPDATE cards SET warrior_id=?, description=?, image_url=? WHERE id=?";
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
    const sqlQuery = "DELETE FROM cards WHERE id=?";
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