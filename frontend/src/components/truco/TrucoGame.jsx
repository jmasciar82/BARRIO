import React, { useState, useEffect } from "react";
import Marcador from "./Marcador";

export default function TrucoGame() {
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);
  const [modo, setModo] = useState(30);
  const [ganador, setGanador] = useState(null);
  const [wakeLockActivo, setWakeLockActivo] = useState(false);

  // 👉 SUMAR
  const sumarA = () => {
    if (!ganador && puntosA < modo) {
      setPuntosA(prev => prev + 1);
    }
  };

  const sumarB = () => {
    if (!ganador && puntosB < modo) {
      setPuntosB(prev => prev + 1);
    }
  };

  // 👉 RESET
  const reset = () => {
    setPuntosA(0);
    setPuntosB(0);
    setGanador(null);
  };

  // 👉 GANADOR
  useEffect(() => {
    if (puntosA >= modo) {
      setGanador("A");
    } else if (puntosB >= modo) {
      setGanador("B");
    }
  }, [puntosA, puntosB, modo]);

  // 👉 WAKE LOCK (pantalla activa)
  useEffect(() => {
    let wakeLock = null;

    const activarWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
          setWakeLockActivo(true);
          console.log("🔋 Wake Lock activado");
        }
      } catch (err) {
        console.log("Error Wake Lock:", err);
      }
    };

    activarWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        activarWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 👉 TEXTO GANADOR
  const textoGanador =
    ganador === "A"
      ? "¡Ganamos nosotros!"
      : ganador === "B"
      ? "¡Ganaron ellos!"
      : null;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{
        textAlign: "center",
        padding: "10px",
        background: "#111",
        color: "white"
      }}>
        <h2>Anotador Truco</h2>

        {/* INDICADOR */}
        <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
          {wakeLockActivo ? "🔋 Pantalla activa" : ""}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px"
        }}>
          <button
            onClick={() => setModo(15)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: modo === 15 ? "#22c55e" : "#444",
              color: "white"
            }}
          >
            A 15
          </button>

          <button
            onClick={() => setModo(30)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: modo === 30 ? "#22c55e" : "#444",
              color: "white"
            }}
          >
            A 30
          </button>
        </div>

        <button onClick={reset} style={{ marginTop: "10px" }}>
          Reset
        </button>
      </div>

      {/* GANADOR */}
      {textoGanador && (
        <div style={{
          textAlign: "center",
          fontSize: "2rem",
          background: ganador === "A" ? "#1e3a8a" : "#991b1b",
          color: "white"
        }}>
          {textoGanador}
        </div>
      )}

      {/* PANTALLA */}
      <div style={{
        flex: 1,
        display: "flex",
        background: "radial-gradient(circle at center, #2e7d32 0%, #1b5e20 100%)"
      }}>
        <div style={{ flex: 1, display: "flex", position: "relative" }}>

          {/* Línea */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "4px",
            background: "rgba(255,255,255,0.3)",
            transform: "translateX(-50%)",
            pointerEvents: "none"
          }} />

          {/* NOSOTROS */}
          <div onClick={sumarA} style={lado}>
            <Titulo texto="NOSOTROS" />
            <Marcador puntos={puntosA} modo={modo} />
          </div>

          {/* ELLOS */}
          <div onClick={sumarB} style={lado}>
            <Titulo texto="ELLOS" />
            <Marcador puntos={puntosB} modo={modo} />
          </div>

        </div>
      </div>
    </div>
  );
}

// estilos reutilizables
const lado = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  position: "relative"
};

function Titulo({ texto }) {
  return (
    <div style={{
      position: "absolute",
      top: "10px",
      fontSize: "1.5rem",
      fontWeight: "bold",
      letterSpacing: "2px",
      textShadow: "2px 2px 6px rgba(0,0,0,0.7)"
    }}>
      {texto}
    </div>
  );
}
