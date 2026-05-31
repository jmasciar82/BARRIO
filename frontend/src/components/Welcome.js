import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [serverReady, setServerReady] = useState(false);

  const motivationalMessages = [
    "Preparando todo para tu mejor experiencia...",
    "Grandes cosas empiezan con pequeños momentos como este...",
    "Tu tiempo es valioso, gracias por esperar...",
    "Mientras cargamos, recuerda: hoy es un gran día...",
    "Preparando la parrilla para tus mejores momentos...",
    "Cada momento de espera acerca a un momento de disfrute..."
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  const getBackgroundImage = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();
    const year = today.getFullYear();

    // Mundial 2026: Junio 11 - Julio 19
    if (year === 2026 && ((month === 6 && day >= 11) || (month === 7 && day <= 19))) {
      return '/assets/backgrounds/fondo_mundial_1779764916277.png';
    }

    // Fechas patrias (25 de mayo, 20 de junio, 9 de julio)
    if ((month === 5 && day === 25) || (month === 6 && day === 20) || (month === 7 && day === 9)) {
      return '/assets/backgrounds/fondo_patrio_1779764902332.png';
    }

    // Estaciones (Hemisferio Sur)
    // Verano: Dic 21 - Mar 20
    if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day <= 20)) {
      return '/assets/backgrounds/fondo_verano_1779764842474.png';
    }
    // Otoño: Mar 21 - Jun 20
    if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
      return '/assets/backgrounds/fondo_otono_1779764858267.png';
    }
    // Invierno: Jun 21 - Sep 20
    if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day <= 20)) {
      return '/assets/backgrounds/fondo_invierno_1779764872297.png';
    }
    // Primavera: Sep 21 - Dic 20
    if ((month === 9 && day >= 21) || month === 10 || month === 11 || (month === 12 && day <= 20)) {
      return '/assets/backgrounds/fondo_primavera_1779764886087.png';
    }

    return '/assets/backgrounds/fondo_verano_1779764842474.png'; // fallback
  };

  const dynamicBackgroundStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${getBackgroundImage()}") center / cover no-repeat`
  };

  const checkServerStatus = async () => {
    try {
      const isReady = Math.random() > 0.5;
      if (isReady) {
        setServerReady(true);
        setIsLoading(false);
      }
      return isReady;
    } catch (error) {
      console.error("Error checking server status:", error);
      return false;
    }
  };

  useEffect(() => {
    setMotivationalMessage(getRandomMessage());

    let messageInterval;
    let statusCheckInterval;

    const initializeLoading = async () => {
      const isReady = await checkServerStatus();

      if (!isReady) {
        messageInterval = setInterval(() => {
          setMotivationalMessage(getRandomMessage());
        }, 3000);

        statusCheckInterval = setInterval(() => {
          checkServerStatus();
        }, 5000);
      }
    };

    initializeLoading();

    return () => {
      clearInterval(messageInterval);
      clearInterval(statusCheckInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="welcome-container" style={dynamicBackgroundStyle}>
        <h1>Barrio Tiro Federal</h1>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-message">{motivationalMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container" style={dynamicBackgroundStyle}>
      <h1>Bienvenido al Barrio Tiro Federal</h1>
      <p>¡Gracias por visitar nuestro sitio web!</p>

      <Link to="/reservas" className="reservation-link">
        Reservar Parrilla
      </Link>
    </div>
  );
};

export default Welcome;
