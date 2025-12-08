import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Reservation from './components/Reservation.js';
import FootballReservation from './components/FootballReservation';
import JurassicDenied from './components/JurassicDenied';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservas" element={<Reservation />} />
        <Route path="/futbol" element={<JurassicDenied />} />
        {/* Puedes añadir más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;