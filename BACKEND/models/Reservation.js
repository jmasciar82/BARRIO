// models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  shift: { type: String, enum: ['dia', 'noche'], required: true },
  grillNumber: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Exportación como default
const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;