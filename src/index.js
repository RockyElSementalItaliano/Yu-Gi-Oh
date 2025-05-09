import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde el archivo .env en la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app/app.js';

const PORT = process.env.PORT || 3000; // Cambiar puerto por defecto a 3000 para npm run dev

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Abre la siguiente URL en tu navegador: http://localhost:${PORT}`);
});
