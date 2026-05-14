import {
  useState
} from "react";

import "../styles/players.css";

const jugadoresFrecuentes = [

  "RAMI",
  "JUAN",
  "FEDE",
  "TINCHO",
  "CHARLY",
  "QUIQUE"
];

export default function PlayerManager({
  jugadores,
  setJugadores,
  sortearEquipos
}) {

  const [nuevo,
    setNuevo] =
    useState("");

  /* =========================
     AGREGAR
  ========================= */

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

  /* =========================
     ELIMINAR
  ========================= */

  const eliminarJugador = (
    index
  ) => {

    setJugadores(prev =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================
     ENTER
  ========================= */

  const handleKeyDown = (
    e
  ) => {

    if (e.key === "Enter") {

      agregarJugador(nuevo);
    }
  };

  return (
    <div className="players-panel">

      <h2>
        👥 Jugadores
      </h2>

      {/* QUICK PLAYERS */}

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

      {/* INPUT */}

      <div className="player-input">

        <input
          value={nuevo}
          onChange={(e) =>
            setNuevo(e.target.value)
          }
          onKeyDown={handleKeyDown}
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

      {/* PLAYERS */}

      <div className="players-grid">

        {jugadores.map(
          (j, i) => (

            <div
              key={i}
              className="player-chip"
            >

              <span>
                {j}
              </span>

              <span
                className="remove-player"
                onClick={() =>
                  eliminarJugador(i)
                }
              >
                ✕
              </span>

            </div>
          )
        )}

      </div>

      {/* SHUFFLE */}

      <button
        className="shuffle-btn"
        onClick={sortearEquipos}
      >
        🎲 Sortear Equipos
      </button>

    </div>
  );
}