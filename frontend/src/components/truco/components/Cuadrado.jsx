export default function Cuadrado({ valor, color = "white", size = 40 }) {
  // Definimos las coordenadas y dirección de los fósforos (cabeza en x2, y2)
  const fosforos = [
    { id: "left",   coords: { x1: 5,  y1: 35, x2: 5,  y2: 5  } }, // Izquierdo, cabeza arriba
    { id: "top",    coords: { x1: 5,  y1: 5,  x2: 35, y2: 5  } }, // Superior, cabeza derecha
    { id: "right",  coords: { x1: 35, y1: 5,  x2: 35, y2: 35 } }, // Derecho, cabeza abajo
    { id: "bottom", coords: { x1: 35, y1: 35, x2: 5,  y2: 35 } }, // Inferior, cabeza izquierda
    { id: "cross",  coords: { x1: 5,  y1: 35, x2: 35, y2: 5  } }, // Diagonal, cabeza arriba-derecha
  ];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      style={{ overflow: 'visible' }}
    >
      {fosforos.slice(0, valor).map((fosforo) => (
        <g key={fosforo.id} style={{ transition: "all 0.5s ease" }}>
          {/* Cuerpo del fósforo (madera) */}
          <line
            x1={fosforo.coords.x1}
            y1={fosforo.coords.y1}
            x2={fosforo.coords.x2}
            y2={fosforo.coords.y2}
            stroke="#e29c45"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Cabeza del fósforo (roja) */}
          <circle
            cx={fosforo.coords.x2}
            cy={fosforo.coords.y2}
            r="3.5"
            fill="#ff3b30"
          />
        </g>
      ))}
    </svg>
  );
}