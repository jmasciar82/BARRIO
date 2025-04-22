import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import backendURL from '../config.js';
import { format, isSameDay } from 'date-fns';
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

  // Normalizar fecha para comparación
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Obtener reservas cuando cambia la fecha
  useEffect(() => {
    const fetchData = async () => {
      try {
        const normalizedDate = normalizeDate(selectedDate);
        const response = await axios.get(`${backendURL}/reservations/${normalizedDate.toISOString()}`);
        
        // Asegurar que todas las fechas son objetos Date
        const reservationsWithDates = response.data.map(res => ({
          ...res,
          date: new Date(res.date)
        }));
        
        setReservations(reservationsWithDates);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setMessage({ text: 'Error al obtener reservas', type: 'error' });
      }
    };
    
    fetchData();
  }, [selectedDate]);

  // Verificar disponibilidad mejorada
  if (isGrillReserved(grillNumber, shift)) {
    // Actualizar reservas para reflejar cambios recientes
    try {
      const normalizedDate = normalizeDate(selectedDate);
      const updatedResponse = await axios.get(`${backendURL}/reservations/${normalizedDate.toISOString()}`);
      setReservations(updatedResponse.data.map(res => ({
        ...res,
        date: new Date(res.date)
      })));
    } catch (fetchError) {
      console.error('Error actualizando reservas:', fetchError);
    }
    
    setMessage({ 
      text: `La parrilla ${grillNumber} ya está reservada para el turno ${shift === 'dia' ? 'del día' : 'de la noche'}`,
      type: 'error'
    });
    return;
  }
  

  // Manejar reserva con validación reforzada
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación frontend
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
      const response = await axios.post(`${backendURL}/reservations`, {
        date: normalizedDate,
        shift,
        grillNumber,
        user: userName
      });

      // Actualizar el estado con la nueva reserva
      const newReservation = {
        ...response.data,
        date: new Date(response.data.date)
      };

      // Actualizar lista de reservas y limpiar formulario
      setReservations(prev => [...prev, newReservation]);
      setMessage({ text: '¡Reserva exitosa!', type: 'success' });
      setUserName('');
      
      // Forzar actualización de disponibilidad
      const updatedResponse = await axios.get(`${backendURL}/reservations/${normalizedDate.toISOString()}`);
      setReservations(updatedResponse.data.map(res => ({
        ...res,
        date: new Date(res.date)
      })));

    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      'Error al procesar la reserva. Por favor intente nuevamente.';
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Encontrar usuario que reservó
  const findReservationUser = (grillNum, shiftType) => {
    const reservation = reservations.find(r => {
      const reservationDate = normalizeDate(r.date);
      const currentDate = normalizeDate(selectedDate);
      return (
        r.grillNumber === grillNum && 
        r.shift === shiftType &&
        reservationDate.getTime() === currentDate.getTime()
      );
    });
    return reservation ? reservation.user : '';
  };

  // Renderizar tabla de disponibilidad
  const renderAvailabilityTable = () => {
    return (
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
              <tr key={`grill-${num}`}>
                <td>Parrilla {num}</td>
                <td className={isGrillReserved(num, 'dia') ? 'reserved' : 'available'}>
                  {isGrillReserved(num, 'dia') ? 
                    `✖ Ocupada por: ${findReservationUser(num, 'dia')}` : 
                    '✔ Disponible'}
                </td>
                <td className={isGrillReserved(num, 'noche') ? 'reserved' : 'available'}>
                  {isGrillReserved(num, 'noche') ? 
                    `✖ Ocupada por: ${findReservationUser(num, 'noche')}` : 
                    '✔ Disponible'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="reservation-container">
      <h2>Reserva de Parrillas</h2>
      
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <label>Fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            locale={es}
            className="date-picker-input"
          />
        </div>
        
        <div className="form-group">
          <label>Turno:</label>
          <select 
            value={shift} 
            onChange={(e) => {
              setShift(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            className={`form-select ${isGrillReserved(grillNumber, shift) ? 'input-error' : ''}`}
          >
            <option value="dia">Día (12:00 - 18:00)</option>
            <option value="noche">Noche (19:00 - 24:00)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Parrilla:</label>
          <select 
            value={grillNumber} 
            onChange={(e) => {
              setGrillNumber(parseInt(e.target.value));
              setMessage({ text: '', type: '' });
            }}
            className={`form-select ${isGrillReserved(grillNumber, shift) ? 'input-error' : ''}`}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option 
                key={num} 
                value={num}
                disabled={isGrillReserved(num, shift)}
              >
                Parrilla {num} {isGrillReserved(num, shift) ? '(Ocupada)' : '(Disponible)'}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            placeholder="Ingrese su nombre completo"
            className="form-input"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isGrillReserved(grillNumber, shift) || isSubmitting}
          className={`submit-btn ${isGrillReserved(grillNumber, shift) ? 'btn-disabled' : ''}`}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span> Procesando...
            </>
          ) : (
            'Reservar'
          )}
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