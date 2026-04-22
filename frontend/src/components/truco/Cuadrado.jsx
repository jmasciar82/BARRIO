import React from "react";

export default function Cuadrado({ valor, color = "white" }) {
  return (
    <div style={contenedor}>
      {valor >= 1 && <div style={{ ...ladoIzq, backgroundColor: color }} />}
      {valor >= 2 && <div style={{ ...ladoArriba, backgroundColor: color }} />}
      {valor >= 3 && <div style={{ ...ladoDer, backgroundColor: color }} />}
      {valor >= 4 && <div style={{ ...ladoAbajo, backgroundColor: color }} />}
      {valor === 5 && <div style={{ ...diagonal, backgroundColor: color }} />}
    </div>
  );
}

const contenedor = {
  position: "relative",
  width: "50px",
  height: "50px"
};

const base = { position: "absolute" };

const ladoIzq = { ...base, width: "4px", height: "100%", left: 0 };
const ladoArriba = { ...base, height: "4px", width: "100%", top: 0 };
const ladoDer = { ...base, width: "4px", height: "100%", right: 0 };
const ladoAbajo = { ...base, height: "4px", width: "100%", bottom: 0 };

const diagonal = {
  position: "absolute",
  width: "4px",
  height: "140%",
  transform: "rotate(45deg)",
  left: "50%",
  top: "-20%"
};
