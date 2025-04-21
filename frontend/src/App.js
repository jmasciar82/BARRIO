import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';  // Nota el ./ al inicio
import Reservation from './components/Reservation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/reservas" element={<Reservation />} />
      </Routes>
    </Router>
  );
}

export default App;