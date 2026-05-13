export default function Cuadrado({ valor, color = "white", size = 40 }) {
  // Definimos las coordenadas de las líneas (x1, y1, x2, y2)
  const lineas = [
    { id: "left",   coords: { x1: 5,  y1: 5,  x2: 5,  y2: 35 } }, // Lado izquierdo
    { id: "top",    coords: { x1: 5,  y1: 5,  x2: 35, y2: 5  } }, // Lado superior
    { id: "right",  coords: { x1: 35, y1: 5,  x2: 35, y2: 35 } }, // Lado derecho
    { id: "bottom", coords: { x1: 5,  y1: 35, x2: 35, y2: 35 } }, // Lado inferior
    { id: "cross",  coords: { x1: 5,  y1: 35, x2: 35, y2: 5  } }, // Diagonal
  ];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      style={{ overflow: 'visible' }}
    >
      {lineas.slice(0, valor).map((linea) => (
        <line
          key={linea.id}
          x1={linea.coords.x1}
          y1={linea.coords.y1}
          x2={linea.coords.x2}
          y2={linea.coords.y2}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round" // Esto hace que las puntas sean redondeadas y "pro"
          style={{ transition: "all 0.5s ease" }} // Animación suave al aparecer
        />
      ))}
    </svg>
  );
}