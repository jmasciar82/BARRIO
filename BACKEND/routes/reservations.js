import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// Helper para normalizar fechas
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Obtener reservas por fecha
router.get('/:date', async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);
    const reservations = await Reservation.find({ date });

    res.json(reservations.map(res => ({
      ...res._doc,
      date: res.date.toISOString()
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  const { date, shift, grillNumber, user } = req.body;

  try {
    const reservationDate = normalizeDate(date);

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
