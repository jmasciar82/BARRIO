import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHolidayOrSeasonTheme } from '../utils/holidayTheme';
import './Welcome.css';

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [serverReady, setServerReady] = useState(false);

  const currentTheme = getHolidayOrSeasonTheme(new Date());

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

  const dynamicBackgroundStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("${currentTheme.background}") center / cover no-repeat, #0f172a`
  };

  const dynamicButtonStyle = {
    background: currentTheme.buttonGradient
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="welcome-container" style={dynamicBackgroundStyle}>
        {currentTheme.badge && (
          <div className="holiday-badge">{currentTheme.badge}</div>
        )}
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
      {currentTheme.badge && (
        <div className="holiday-badge">{currentTheme.badge}</div>
      )}
      <h1>Bienvenido al Barrio Tiro Federal</h1>
      <p>{currentTheme.subtitle}</p>

      <Link to="/reservas" className="reservation-link" style={dynamicButtonStyle}>
        Reservar Parrilla
      </Link>
    </div>
  );
};

export default Welcome;
