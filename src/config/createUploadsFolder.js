import fs from 'fs';
import path from 'path';

export const createUploadsFolder = () => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
    console.log('Carpeta uploads creada');
  }
};
