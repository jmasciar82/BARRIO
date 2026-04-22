import React from "react";
import Cuadrado from "./Cuadrado";

export default function Marcador({ puntos, modo }) {
    const malas = modo === 30 ? Math.min(puntos, 15) : puntos;
    const buenas = modo === 30 && puntos > 15 ? puntos - 15 : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Grupo puntos={malas} color="white" />
            {modo === 30 && buenas > 0 && (
                <Grupo puntos={buenas} color="limegreen" />
            )}
        </div>
    );
}

function Grupo({ puntos, color }) {
    const grupos = Math.floor(puntos / 5);
    const resto = puntos % 5;

    const cuadrados = [];

    for (let i = 0; i < grupos; i++) {
        cuadrados.push(<Cuadrado key={i} valor={5} color={color} />);
    }

    if (resto > 0) {
        cuadrados.push(<Cuadrado key="resto" valor={resto} color={color} />);
    }

    return (
        <div style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(5, auto)",
            gap: "8px"
        }}>
            {cuadrados}
        </div>
    );
}
