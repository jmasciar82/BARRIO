import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import reservationRoutes from './routes/reservations.js';
import dotenv from 'dotenv';
import path from 'path';

// Importar __dirname en ES module
const __dirname = path.resolve();

// Configuración de dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Rutas de la API
app.use('/api/reservations', reservationRoutes);

// Si se define SERVE_FRONTEND, servir archivos estáticos
if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔥 MongoDB conectado');
  } catch (err) {
    console.error('❌ Error al conectar MongoDB:', err.message);
    process.exit(1);
  }
};

// Arrancar servidor
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5075;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();
