import Marcador from "./Marcador";

import "../styles/team.css";

export default function TeamPanel({
  nombre,
  puntos,
  modo,
  sumar,
  habilitado
}) {

  return (
    <div className="team-panel">

      <h2>{nombre}</h2>

      <Marcador
        puntos={puntos}
        modo={modo}
      />

      <div className="score-buttons">

        <button
          disabled={!habilitado}
          onClick={() => sumar(1)}
        >
          +1
        </button>

        <button
          disabled={!habilitado}
          onClick={() => sumar(2)}
        >
          Truco
        </button>

        <button
          disabled={!habilitado}
          onClick={() => sumar(3)}
        >
          Retruco
        </button>

        <button
          disabled={!habilitado}
          onClick={() => sumar(4)}
        >
          Vale 4
        </button>

      </div>

    </div>
  );
}