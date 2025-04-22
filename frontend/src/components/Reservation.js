import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import backendURL from '../config.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './Reservation.css';

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shift, setShift] = useState('dia');
  const [grillNumber, setGrillNumber] = useState(1);
  const [userName, setUserName] = useState('');
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const fetchReservations = useCallback(async (date) => {
    try {
      const normalizedDate = normalizeDate(date);
      const response = await axios.get(`${backendURL}/reservations/${normalizedDate.toISOString()}`);
      setReservations(response.data.map(res => ({
        ...res,
        date: new Date(res.date) // Aseguramos que la fecha sea tipo Date
      })));
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setMessage({ text: 'Error al obtener reservas', type: 'error' });
    }
  }, []);

  const isGrillReserved = (grillNum, shiftType) => {
    return reservations.some(r => (
      r.grillNumber === grillNum &&
      r.shift === shiftType &&
      normalizeDate(r.date).getTime() === normalizeDate(selectedDate).getTime()
    ));
  };

  const findReservationUser = (grillNum, shiftType) => {
    const reservation = reservations.find(r => (
      r.grillNumber === grillNum &&
      r.shift === shiftType &&
      normalizeDate(r.date).getTime() === normalizeDate(selectedDate).getTime()
    ));
    return reservation ? reservation.user : '';
  };

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, fetchReservations]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGrillReserved(grillNumber, shift)) {
      setMessage({
        text: `La parrilla ${grillNumber} ya está reservada para el turno ${shift === 'dia' ? 'del día' : 'de la noche'}`,
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const normalizedDate = normalizeDate(selectedDate);

      await axios.post(`${backendURL}/reservations`, {
        date: normalizedDate,
        shift,
        grillNumber,
        user: userName
      });

      const newReservation = {
        date: normalizedDate,
        shift,
        grillNumber,
        user: userName
      };

      // 🔥 Agrego la nueva reserva directamente al estado
      setReservations(prev => [...prev, newReservation]);

      setMessage({ text: '¡Reserva exitosa!', type: 'success' });
      setUserName('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al procesar la reserva. Por favor intente nuevamente.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAvailabilityTable = () => (
    <div className="availability-table">
      <h3>Estado de Reservas - {format(selectedDate, 'PPPP', { locale: es })}</h3>
      <table>
        <thead>
          <tr>
            <th>Parrilla</th>
            <th>Turno Mañana (12-18hs)</th>
            <th>Turno Noche (19-24hs)</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map(num => (
            <tr key={num}>
              <td>{num}</td>
              <td>{isGrillReserved(num, 'dia') ? `Ocupada por ${findReservationUser(num, 'dia')}` : 'Disponible'}</td>
              <td>{isGrillReserved(num, 'noche') ? `Ocupada por ${findReservationUser(num, 'noche')}` : 'Disponible'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="reservation-form">
      <h2>Reserva Tu Parrilla</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="form-group">
          <label>Turno</label>
          <select value={shift} onChange={e => setShift(e.target.value)}>
            <option value="dia">Mañana (12-18hs)</option>
            <option value="noche">Noche (19-24hs)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Parrilla</label>
          <select value={grillNumber} onChange={e => setGrillNumber(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{`Parrilla ${num}`}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Tu nombre"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cargando...' : 'Realizar Reserva'}
        </button>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {renderAvailabilityTable()}
    </div>
  );
};

export default Reservation;
