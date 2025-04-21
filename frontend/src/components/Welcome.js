import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Bienvenido al Barrio Tiro Federal</h1>
      <p>¡Gracias por visitar nuestro sitio web!</p>
      <Link to="/reservas" className="reservation-link">
        Reservar Parrilla
      </Link>
    </div>
  );
};

export default Welcome;