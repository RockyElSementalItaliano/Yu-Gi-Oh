import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Servir archivos estáticos desde la carpeta assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Importación de rutas utilizando ES6
import authRoutes from '../routes/authRoutes.js';
import cardsRoutes from '../routes/cardsRoutes.js';
import multer from 'multer';
import multerConfig from '../config/multerConfig.js';
import fightRoutes from '../routes/fightRoutes.js';
import gameRoutes from '../routes/gameRoutes.js';
import matchesRoutes from '../routes/matchesRoutes.js';
import playerSelectionRoutes from '../routes/playerSelectionRoutes.js';
import racesRoutes from '../routes/racesRoutes.js';
import rankingRoutes from '../routes/rankingRoutes.js';
import spellsRoutes from '../routes/spellsRoutes.js';
import usersRoutes from '../routes/usersRoutes.js';
import warriorsRoutes from '../routes/warriorsRoutes.js'; 
import typeWarriorRoutes from '../routes/typeWarriorRoutes.js';
import powerRoutes from '../routes/powerRoutes.js';
import trainerRoutes from '../routes/trainerRoutes.js';

// Declaración de rutas
app.use('/game/auth', authRoutes);
app.use('/game/cards', cardsRoutes);
app.use('/game/fight', fightRoutes);
app.use('/game/game', gameRoutes);
app.use('/game/matches', matchesRoutes);
app.use('/game/playerselection', playerSelectionRoutes);
app.use('/game/races', racesRoutes);
app.use('/game/ranking', rankingRoutes);
app.use('/game/spells', spellsRoutes);
app.use('/game/users', usersRoutes);
app.use('/game/warriors', warriorsRoutes);
app.use('/game/typewarriors', typeWarriorRoutes);
app.use('/game/powers', powerRoutes);
app.use('/game/trainers', trainerRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, 'assets/views') });
});

// Ruta para servir register.html
app.get('/register.html', (req, res) => {
  res.sendFile('register.html', { root: path.join(__dirname, 'assets/views') });
});

// Ruta para servir select-warriors.html
app.get('/select-warriors', (req, res) => {
  res.sendFile('select-warriors.html', { root: path.join(__dirname, 'assets/views') });
});

// Servir archivos estáticos para js y css desde assets
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/img', express.static(path.join(__dirname, 'assets/img')));

// Ruta para servir home.html
// app.get('/home', (req, res) => {
//   res.sendFile('home.html', { root: path.join(__dirname, 'assets/views') });
// });

export default app;
