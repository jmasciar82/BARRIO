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
    "El emprendedor descubre oportunidades donde otros no las ven",
    "El futuro es incierto, pero la adaptación es clave",
    "La acción humana es conducta con propósito",
    'El conocimiento está disperso en la sociedad',
    'Cada individuo es único en sus preferencias y conocimientos',
    'La cooperación social voluntaria crea prosperidad',
    'La competencia es un proceso de descubrimiento',
    
    // ... (otros mensajes igual que antes)
  ];
  // Función para obtener un mensaje aleatorio
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    return motivationalMessages[randomIndex];
  };

  const checkServerStatus = async () => {
    try {
      // Simulamos una verificación de servidor
      // En producción, reemplaza con tu llamada real a la API
      const isReady = Math.random() > 0.5; // 20% de probabilidad de estar listo
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
    // Establece un mensaje inicial inmediatamente
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
      <div className="welcome-container">
        <h1>Barrio Tiro Federal</h1>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-message">{motivationalMessage}</p>
        </div>
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