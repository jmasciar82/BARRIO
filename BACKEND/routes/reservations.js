import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// Helper para normalizar fechas en UTC (00:00:00.000Z)
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);  // Asegura que la fecha sea en UTC a medianoche
  return d;
};

// Obtener reservas por fecha
router.get('/:date', async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);
    const reservations = await Reservation.find({
      date: { $gte: date, $lt: new Date(date.getTime() + 86400000) }  // Intervalo de 24 horas en UTC
    });

    res.json(reservations.map(res => ({
      ...res._doc,
      date: res.date.toISOString()  // Devolver la fecha en formato ISO
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  const { date, shift, grillNumber, user } = req.body;

  try {
    const reservationDate = normalizeDate(date);  // Normalizamos la fecha a UTC

    // Comprobamos si ya existe una reserva para esa parrilla en ese turno
    const existingReservation = await Reservation.findOne({
      date: reservationDate,
      shift,
      grillNumber
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: `La parrilla ${grillNumber} ya está reservada para el turno ${shift}`
      });
    }

    const newReservation = new Reservation({
      date: reservationDate,
      shift,
      grillNumber,
      user
    });

    await newReservation.save();

    res.status(201).json({
      success: true,
      message: 'Reserva exitosa'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
