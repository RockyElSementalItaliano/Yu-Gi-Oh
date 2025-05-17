import bcrypt from 'bcrypt';
import { connect } from '../src/config/db/connect.js';

const saltRounds = 10;

async function hashPlainPasswords() {
  try {
    // Obtener usuarios con contraseñas no hasheadas (ejemplo: que no empiecen con $2b$)
    const [users] = await connect.query("SELECT id, password FROM users WHERE password NOT LIKE '$2b$%'");

    if (users.length === 0) {
      console.log('No se encontraron contraseñas en texto plano.');
      return;
    }

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await connect.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
      console.log(`Contraseña hasheada para usuario ID ${user.id}`);
    }

    console.log('Actualización de contraseñas completada.');
  } catch (error) {
    console.error('Error al actualizar contraseñas:', error);
  } finally {
    process.exit();
  }
}

hashPlainPasswords();
