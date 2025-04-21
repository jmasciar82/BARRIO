import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import reservationRoutes from './routes/reservations.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (versión actualizada)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔥 MongoDB conectado exitosamente');
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    return false;
  }
};

// Rutas
app.use('/api/reservations', reservationRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Función para encontrar puerto disponible
const findAvailablePort = async (desiredPort) => {
  const net = await import('net');
  let port = desiredPort;
  
  while (port < 65535) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
    
    if (available) return port;
    port++;
  }
  throw new Error('No hay puertos disponibles');
};

// Iniciar servidor
const startServer = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) process.exit(1);

  const desiredPort = parseInt(process.env.PORT || 5075);
  try {
    const availablePort = await findAvailablePort(desiredPort);
    
    if (availablePort !== desiredPort) {
      console.warn(`⚠️ Puerto ${desiredPort} ocupado, usando ${availablePort} en su lugar`);
    }

    const server = app.listen(availablePort, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${availablePort}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto ${availablePort} está en uso inesperadamente`);
      }
      console.error('Error del servidor:', err);
    });
  } catch (err) {
    console.error('❌ Error al iniciar servidor:', err.message);
    process.exit(1);
  }
};

startServer();