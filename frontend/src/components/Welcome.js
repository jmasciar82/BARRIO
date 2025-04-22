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
    "La paciencia es la madre de todas las virtudes...",
    "Buenas cosas vienen para aquellos que esperan...",
    "Estamos trabajando para darte lo mejor...",
    "Preparando la parrilla para tus mejores momentos...",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día...",
    "Tu actitud positiva es tu mayor superpoder...",
    "Cada momento de espera acerca a un momento de disfrute...",
    // ... (otros mensajes igual que antes)
  ];

  // Función para verificar si el servidor está listo
  const checkServerStatus = async () => {
    try {
      // Aquí puedes hacer una petición a tu API para verificar si está lista
      const response = await fetch('/api/health-check');
      if (response.ok) {
        setServerReady(true);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  useEffect(() => {
    let messageInterval;
    let statusCheckInterval;
    let timeout;

    // Verificar inmediatamente si el servidor está listo
    checkServerStatus().then((isReady) => {
      if (!isReady) {
        // Si no está listo, configuramos los intervalos de mensajes
        messageInterval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
          setMotivationalMessage(motivationalMessages[randomIndex]);
        }, 5000);

        // Verificar el estado del servidor cada 5 segundos
        statusCheckInterval = setInterval(() => {
          checkServerStatus();
        }, 5000);

        // Timeout de respaldo por si acaso (50 segundos)
        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 15000);
      }
    });

    // Si el servidor está listo rápidamente, cancelamos los intervalos y la lógica de espera
    if (serverReady) {
      clearInterval(messageInterval);
      clearInterval(statusCheckInterval);
      clearTimeout(timeout);
    }

    return () => {
      clearInterval(messageInterval);
      clearInterval(statusCheckInterval);
      clearTimeout(timeout);
    };
  }, [serverReady]);

  if (isLoading && !serverReady) {
    return (
      <div className="welcome-container loading">
        <h1>Barrio Tiro Federal</h1>
        <div className="loading-spinner"></div>
        <p className="motivational-message">{motivationalMessage}</p>
        <p className="loading-text">Cargando, por favor espera...</p>
      </div>
    );
  }

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
