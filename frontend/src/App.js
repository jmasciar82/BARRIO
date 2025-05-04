import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Reservation from './components/Reservation.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservas" element={<Reservation />} />
        {/* Puedes añadir más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;