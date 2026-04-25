import React, { useState, useEffect } from "react";
import Marcador from "./Marcador";

export default function TrucoGame() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [modo, setModo] = useState(30);
  const [ganador, setGanador] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [nombreA, setNombreA] = useState(
    localStorage.getItem("nombreA") || "NOSOTROS"
  );
  const [nombreB, setNombreB] = useState(
    localStorage.getItem("nombreB") || "ELLOS"
  );
  const [editando, setEditando] = useState(null);

  // guardar nombres
  useEffect(() => {
    localStorage.setItem("nombreA", nombreA);
    localStorage.setItem("nombreB", nombreB);
  }, [nombreA, nombreB]);

  // registrar jugada
  const registrarJugada = (equipo, puntos) => {
    setHistorial(prev => [...prev, { equipo, puntos }]);
  };

  // sumar
  const sumarA = () => {
    if (!ganador && puntosA < modo) {
      setPuntosA(prev => prev + 1);
      registrarJugada("A", 1);
    }
  };

  const sumarB = () => {
    if (!ganador && puntosB < modo) {
      setPuntosB(prev => prev + 1);
      registrarJugada("B", 1);
    }
  };

  // deshacer
  const deshacer = () => {
    if (historial.length === 0) return;

    const ultima = historial[historial.length - 1];

    if (ultima.equipo === "A") {
      setPuntosA(prev => Math.max(0, prev - ultima.puntos));
    } else {
      setPuntosB(prev => Math.max(0, prev - ultima.puntos));
    }

    setHistorial(prev => prev.slice(0, -1));
    setGanador(null);
  };

  // reset
  const reset = () => {
    setPuntosA(0);
    setPuntosB(0);
    setHistorial([]);
    setGanador(null);
  };

  // ganador
  useEffect(() => {
    if (puntosA >= modo) setGanador("A");
    else if (puntosB >= modo) setGanador("B");
  }, [puntosA, puntosB, modo]);

  const textoGanador =
    ganador === "A"
      ? `¡Ganó ${nombreA}!`
      : ganador === "B"
      ? `¡Ganó ${nombreB}!`
      : null;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center",
        padding: 10,
        background: "#111",
        color: "white"
      }}>
        <h2>Truco · {modo === 30 ? "A 30" : "A 15"}</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button onClick={() => setModo(15)}>A 15</button>
          <button onClick={() => setModo(30)}>A 30</button>
        </div>

        <button onClick={deshacer}>↩️ Deshacer</button>
        <button onClick={reset}>Reset</button>
      </div>

      {/* GANADOR */}
      {textoGanador && (
        <div style={{
          textAlign: "center",
          fontSize: "2rem",
          background: "gold"
        }}>
          {textoGanador}
        </div>
      )}

      {/* PANTALLA */}
      <div style={{
        flex: 1,
        display: "flex",
        background: "radial-gradient(circle, #2e7d32, #1b5e20)"
      }}>
        <div style={{ flex: 1, display: "flex", position: "relative" }}>

          {/* línea */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 4,
            background: "rgba(255,255,255,0.3)",
            transform: "translateX(-50%)"
          }} />

          {/* NOSOTROS */}
          <div style={lado} onClick={sumarA}>
            <TituloEditable
              texto={nombreA}
              setTexto={setNombreA}
              lado="A"
              editando={editando}
              setEditando={setEditando}
            />
            <Marcador puntos={puntosA} modo={modo} />
          </div>

          {/* ELLOS */}
          <div style={lado} onClick={sumarB}>
            <TituloEditable
              texto={nombreB}
              setTexto={setNombreB}
              lado="B"
              editando={editando}
              setEditando={setEditando}
            />
            <Marcador puntos={puntosB} modo={modo} />
          </div>

        </div>
      </div>
    </div>
  );
}

const lado = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  color: "white"
};

// 👇 COMPONENTE EDITABLE CORREGIDO
function TituloEditable({ texto, setTexto, lado, editando, setEditando }) {
  const esEditando = editando === lado;
  const valorDefault = lado === "A" ? "NOSOTROS" : "ELLOS";

  const handleGuardar = (valor) => {
    const limpio = valor.trim();

    if (limpio === "") {
      setTexto(valorDefault);
    } else {
      setTexto(limpio.toUpperCase());
    }

    setEditando(null);
  };

  return (
    <div
      style={{ position: "absolute", top: 10 }}
      onClick={(e) => e.stopPropagation()}
    >
      {esEditando ? (
        <input
          autoFocus
          defaultValue={texto}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => handleGuardar(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGuardar(e.target.value);
            }
          }}
          style={{
            fontSize: "1rem",
            textAlign: "center",
            borderRadius: "6px",
            border: "none",
            padding: "4px"
          }}
        />
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEditando(lado);
          }}
          style={{
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {texto}
        </div>
      )}
    </div>
  );
}
