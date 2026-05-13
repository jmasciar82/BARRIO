import { useState } from "react";

import "../styles/players.css";

const jugadoresFrecuentes = [

  "RAMI",
  "JUAN",
  "QUIQUE",
  "CHARLY",
  "TINCHO",
  "FEDE"
];

export default function PlayerManager({
  jugadores,
  setJugadores,
  sortearEquipos
}) {

  const [nuevo, setNuevo] =
    useState("");

  const agregarJugador = (
    nombreInput
  ) => {

    const nombre =
      nombreInput
        .trim()
        .toUpperCase();

    if (!nombre) return;

    const existe =
      jugadores.some(
        j =>
          j.toUpperCase() === nombre
      );

    if (existe) {

      alert(
        "Ese jugador ya existe"
      );

      return;
    }

    setJugadores(prev => [
      ...prev,
      nombre
    ]);

    setNuevo("");
  };

  const eliminarJugador = (index) => {

    setJugadores(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="players-panel">

      <h2>Jugadores</h2>

      <div className="quick-players">

        {jugadoresFrecuentes.map(
          (jugador, i) => (

            <button
              key={i}
              className="quick-player-btn"
              onClick={() =>
                agregarJugador(jugador)
              }
            >
              {jugador}
            </button>
          )
        )}

      </div>

      <div className="player-input">

        <input
          value={nuevo}
          onChange={(e) =>
            setNuevo(e.target.value)
          }
          placeholder="Nombre jugador"
        />

        <button
          onClick={() =>
            agregarJugador(nuevo)
          }
        >
          +
        </button>

      </div>

      <div className="players-grid">

        {jugadores.map((j, i) => (
          <div
            key={i}
            className="player-chip"
          >
            {j}

            <span
              className="remove-player"
              onClick={() =>
                eliminarJugador(i)
              }
            >
              ✕
            </span>

          </div>
        ))}

      </div>

      <button
        className="shuffle-btn"
        onClick={sortearEquipos}
      >
        🎲 Sortear Equipos
      </button>

    </div>
  );
}