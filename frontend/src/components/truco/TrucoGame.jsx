import {
  useState,
  useEffect
} from "react";

import TeamPanel
  from "./components/TeamPanel";

import PlayerManager
  from "./components/PlayerManager";

/*
import Ranking
  from "./components/Ranking";
*/

import {
  guardarPartida
} from "./services/trucoApi";

import "./styles/truco.css";
// import "./styles/ranking.css";

export default function TrucoGame() {

  const [modo, setModo] =
    useState(30);

  const [jugadores, setJugadores] =
    useState([]);

  const [equipoA, setEquipoA] =
    useState([]);

  const [equipoB, setEquipoB] =
    useState([]);

  const [puntosA, setPuntosA] =
    useState(0);

  const [puntosB, setPuntosB] =
    useState(0);

  const [historial, setHistorial] =
    useState([]);

  const [ganadorPartida,
    setGanadorPartida] =
      useState(null);

  const [partidaGuardada,
    setPartidaGuardada] =
      useState(false);

  const [sorteando,
    setSorteando] =
      useState(false);

  /* POPUP JUGADORES */

  const [showPlayers,
    setShowPlayers] =
      useState(false);

  const limite = modo;

  const equiposListos =
    equipoA.length === 2 &&
    equipoB.length === 2;

  const partidaTerminada =
    ganadorPartida !== null;

  /* =========================
     GANADOR
  ========================= */

  useEffect(() => {

    if (
      puntosA >= limite &&
      !ganadorPartida
    ) {

      setGanadorPartida("A");
    }

    if (
      puntosB >= limite &&
      !ganadorPartida
    ) {

      setGanadorPartida("B");
    }

  }, [
    puntosA,
    puntosB,
    limite,
    ganadorPartida
  ]);

  /* =========================
     GUARDAR PARTIDA
  ========================= */

  useEffect(() => {

    const guardar =
      async () => {

        if (
          !ganadorPartida ||
          partidaGuardada
        ) return;

        try {

          await guardarPartida({

            equipoA,

            equipoB,

            puntosA,

            puntosB,

            modo,

            ganador:
              ganadorPartida
          });

          setPartidaGuardada(true);

        } catch (error) {

          console.error(error);
        }
      };

    guardar();

  }, [
    ganadorPartida
  ]);

  /* =========================
     NOMBRE GANADOR
  ========================= */

  const nombreGanador =
    ganadorPartida === "A"
      ? equipoA.join(" & ")
      : ganadorPartida === "B"
        ? equipoB.join(" & ")
        : null;

  /* =========================
     HISTORIAL
  ========================= */

  const guardarEstado = () => {

    setHistorial(prev => [
      ...prev,
      {
        puntosA,
        puntosB
      }
    ]);
  };

  const deshacer = () => {

    if (historial.length === 0)
      return;

    const ultimo =
      historial[
        historial.length - 1
      ];

    setPuntosA(ultimo.puntosA);

    setPuntosB(ultimo.puntosB);

    setHistorial(prev =>
      prev.slice(0, -1)
    );
  };

  /* =========================
     SUMAR
  ========================= */

  const sumarA = (valor) => {

    if (
      partidaTerminada ||
      !equiposListos ||
      sorteando
    ) return;

    guardarEstado();

    setPuntosA(prev =>
      Math.min(
        prev + valor,
        limite
      )
    );
  };

  const sumarB = (valor) => {

    if (
      partidaTerminada ||
      !equiposListos ||
      sorteando
    ) return;

    guardarEstado();

    setPuntosB(prev =>
      Math.min(
        prev + valor,
        limite
      )
    );
  };

  /* =========================
     SORTEO
  ========================= */

  const sortearEquipos = () => {

    if (jugadores.length < 4) {

      alert(
        "Debe haber al menos 4 jugadores"
      );

      return;
    }

    setSorteando(true);

    let interval;

    interval = setInterval(() => {

      const mezclaTemp =
        [...jugadores]
          .sort(
            () =>
              Math.random() - 0.5
          );

      const temp =
        mezclaTemp.slice(0, 4);

      setEquipoA([
        temp[0],
        temp[1]
      ]);

      setEquipoB([
        temp[2],
        temp[3]
      ]);

    }, 100);

    setTimeout(() => {

      clearInterval(interval);

      const mezclaFinal =
        [...jugadores]
          .sort(
            () =>
              Math.random() - 0.5
          );

      const finales =
        mezclaFinal.slice(0, 4);

      setEquipoA([
        finales[0],
        finales[1]
      ]);

      setEquipoB([
        finales[2],
        finales[3]
      ]);

      nuevaPartida();

      setSorteando(false);

      setShowPlayers(false);

    }, 3500);
  };

  /* =========================
     NUEVA PARTIDA
  ========================= */

  const nuevaPartida = () => {

    setPuntosA(0);

    setPuntosB(0);

    setHistorial([]);

    setGanadorPartida(null);

    setPartidaGuardada(false);
  };

  return (
    <div className="truco-app">

      <h1>TRUCO PRO</h1>

      {/* BOTON PLAYERS */}

      <button
        className="players-toggle"
        onClick={() =>
          setShowPlayers(true)
        }
      >
        👥 Jugadores
      </button>

      {/* MODAL */}

      {showPlayers && (

        <div className="players-modal-overlay">

          <div className="players-modal">

            <button
              className="close-modal"
              onClick={() => {

                if (!sorteando) {

                  setShowPlayers(false);
                }
              }}
            >
              ✕
            </button>

            <PlayerManager
              jugadores={jugadores}
              setJugadores={setJugadores}
              sortearEquipos={sortearEquipos}
            />

          </div>

        </div>
      )}

      {/* MODO */}

      <div className="mode-selector">

        <button
          className={
            modo === 15
              ? "active-mode"
              : ""
          }
          onClick={() => setModo(15)}
        >
          A 15
        </button>

        <button
          className={
            modo === 30
              ? "active-mode"
              : ""
          }
          onClick={() => setModo(30)}
        >
          A 30
        </button>

      </div>

      {/* ACCIONES */}

      <div className="top-actions">

        <button
          className="undo-btn"
          onClick={deshacer}
        >
          ↩ Deshacer
        </button>

      </div>

      {/* SORTEO */}

      {sorteando && (

        <div className="shuffle-banner">

          🎲 Sorteando equipos...

        </div>
      )}

      {/* GANADOR */}

      {nombreGanador && (

        <div className="winner-banner">

          🏆 GANÓ {nombreGanador}

          <button
            className="new-game-btn"
            onClick={nuevaPartida}
          >
            Nueva Partida
          </button>

        </div>
      )}

      {/* EQUIPOS */}

      <div className="teams-container">

        <TeamPanel
          nombre={
            equipoA.length > 0
              ? equipoA.join(" & ")
              : "EQUIPO A"
          }
          puntos={puntosA}
          modo={modo}
          sumar={sumarA}
          habilitado={
            equiposListos &&
            !sorteando
          }
        />

        <TeamPanel
          nombre={
            equipoB.length > 0
              ? equipoB.join(" & ")
              : "EQUIPO B"
          }
          puntos={puntosB}
          modo={modo}
          sumar={sumarB}
          habilitado={
            equiposListos &&
            !sorteando
          }
        />

      </div>
      {/* RANKING */}

      {/* <Ranking /> */}

    </div>
  );
}