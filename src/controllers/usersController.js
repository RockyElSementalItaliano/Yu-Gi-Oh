import { connect } from '../config/db/connect.js';

// Mostrar todos los usuarios
export const showUsers = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM users"; // Consulta para obtener todos los usuarios
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve la lista de usuarios
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", details: error.message });
  }
};

// Mostrar un usuario por ID
export const showUserId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM users WHERE id = ?"; // Consulta para obtener un usuario específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(result[0]); // Devuelve el usuario encontrado
  } catch (error) {
    res.status(500).json({ error: "Error fetching user", details: error.message });
  }
};

// Crear un nuevo usuario
export const addUsers = async (req, res) => {
  try {
    const { username, password, email } = req.body; // Datos necesarios para registrar el usuario
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())";
    const [result] = await connect.query(sqlQuery, [username, password, email]);

    res.status(201).json({
      message: "User added successfully",
      data: { id: result.insertId, username, email }
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding user", details: error.message });
  }
};

// Actualizar un usuario por ID
export const updateUsers = async (req, res) => {
  try {
    const { role } = req.body; // Solo actualizar rol
    console.log('updateUsers called with role:', role, 'and id:', req.params.id);

    if (!role) {
      console.log('Missing role in request body');
      return res.status(400).json({ error: "Missing required field: role" });
    }

    if (role !== 'player' && role !== 'admin') {
      console.log('Invalid role value:', role);
      return res.status(400).json({ error: "Invalid role value" });
    }

    const sqlQuery = "UPDATE users SET role=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [role, req.params.id]);

    console.log('SQL update result:', result);

    if (result.affectedRows === 0) {
      console.log('User not found with id:', req.params.id);
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: { role }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
};

// Eliminar un usuario por ID
export const deleteUsers = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM users WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "User deleted successfully",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user", details: error.message });
  }
};
