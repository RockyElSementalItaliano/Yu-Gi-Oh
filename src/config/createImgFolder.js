import fs from 'fs';
import path from 'path';

export const createImgFolder = () => {
  const imgPath = path.join(process.cwd(), 'src', 'app', 'assets', 'img');
  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath, { recursive: true });
    console.log('Carpeta img creada en src/app/assets');
  }
};
