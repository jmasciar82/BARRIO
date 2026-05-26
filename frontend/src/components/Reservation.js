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
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FECHA LOCAL — SIN UTC — SIN ISO
  const toDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtener reservas desde backend
  const fetchReservations = useCallback(async (date) => {
    try {
      setIsLoading(true);

      const dateString = toDateString(date);
      const response = await axios.get(`${backendURL}/reservations/${dateString}`);

      setReservations(response.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setMessage({ text: 'Error al obtener reservas', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, fetchReservations]);

  // Nuevo mapa de reservas O(1)
  const reservationsMap = React.useMemo(() => {
    const map = {};
    const dateString = toDateString(selectedDate);
    reservations.forEach(r => {
      if (r.date === dateString) {
        if (!map[r.grillNumber]) map[r.grillNumber] = {};
        map[r.grillNumber][r.shift] = r.user;
      }
    });
    return map;
  }, [reservations, selectedDate]);

  // Ver si una parrilla está reservada
  const isGrillReserved = (grillNum, shiftType) => {
    return !!reservationsMap[grillNum]?.[shiftType];
  };

  const findReservationUser = (grillNum, shiftType) => {
    return reservationsMap[grillNum]?.[shiftType] || '';
  };

  // Crear reserva
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateString = toDateString(selectedDate);

    if (isGrillReserved(grillNumber, shift)) {
      setMessage({
        text: `La parrilla ${grillNumber} ya está reservada para el turno ${
          shift === 'dia' ? 'del día' : 'de la noche'
        }`,
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post(`${backendURL}/reservations`, {
        date: dateString,
        shift,
        grillNumber,
        user: userName,
      });

      setReservations(prev => [
        ...prev,
        { date: dateString, shift, grillNumber, user: userName }
      ]);

      setMessage({ text: '¡Reserva exitosa!', type: 'success' });
      setUserName('');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Error al procesar la reserva. Intenta nuevamente.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-form">
      <h2>Reserva Tu Parrilla</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha</label>
          <DatePicker
            className="fecha"
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            locale={es}
          />
        </div>

        <div className="form-group">
          <label>Turno</label>
          <select value={shift} onChange={e => setShift(e.target.value)}>
            <option value="dia">Mañana</option>
            <option value="noche">Noche</option>
          </select>
        </div>

        <div className="form-group">
          <label>Selecciona una Parrilla</label>
          <div className="grill-selector">
            {[1, 2, 3, 4, 5].map(num => {
              const reservedBy = findReservationUser(num, shift);
              const isReserved = !!reservedBy;
              return (
                <div
                  key={num}
                  className={`grill-card ${grillNumber === num ? 'selected' : ''} ${isReserved ? 'reserved' : ''}`}
                  onClick={() => {
                    if (!isReserved) setGrillNumber(num);
                  }}
                >
                  <div className="grill-card-title">Parrilla {num}</div>
                  <div className="grill-card-status">
                    {isReserved ? 'Ocupada' : 'Disponible'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Torre - Piso - Dpto</label>
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Torre - Piso - Dpto"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Reservando...' : 'Reservar'}
        </button>
      </form>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="availability-table">
        <h3>
          Estado de Reservas – {format(selectedDate, 'PPPP', { locale: es })}
        </h3>

        {isLoading ? (
          <>
            <div className="loading-message">Cargando reservas...</div>
            <div className="spinner"></div>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Parrilla</th>
                <th>Mañana (12-18hs)</th>
                <th>Noche (19-24hs)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(num => (
                <tr key={num}>
                  <td>{num}</td>
                  <td className={isGrillReserved(num, 'dia') ? 'reserved-cell' : 'available-cell'}>
                    {isGrillReserved(num, 'dia')
                      ? `Ocupada por ${findReservationUser(num, 'dia')}`
                      : 'Disponible'}
                  </td>
                  <td className={isGrillReserved(num, 'noche') ? 'reserved-cell' : 'available-cell'}>
                    {isGrillReserved(num, 'noche')
                      ? `Ocupada por ${findReservationUser(num, 'noche')}`
                      : 'Disponible'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reservation;
