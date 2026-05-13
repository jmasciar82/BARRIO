import {
  useEffect,
  useState
} from "react";

import {
  obtenerRanking
} from "../services/trucoApi";

import "../styles/ranking.css";

export default function Ranking() {

  const [ranking, setRanking] =
    useState(null);

  useEffect(() => {

    cargarRanking();

  }, []);

  const cargarRanking =
    async () => {

      try {

        const res =
          await obtenerRanking();

        setRanking(res.data);

      } catch (error) {

        console.error(error);
      }
    };

  if (!ranking) {

    return (
      <div className="ranking-panel">
        Cargando ranking...
      </div>
    );
  }

  return (
    <div className="ranking-wrapper">

      <div className="ranking-panel">

        <h2>
          🏆 Ranking Jugadores
        </h2>

        {ranking.jugadores.length === 0 && (
          <p>
            Sin partidas todavía
          </p>
        )}

        {ranking.jugadores.map(
          ([nombre, wins], i) => (

            <div
              key={i}
              className="ranking-item"
            >
              <span>
                #{i + 1} {nombre}
              </span>

              <strong>
                {wins} wins
              </strong>
            </div>
          )
        )}

      </div>

      <div className="ranking-panel">

        <h2>
          🤝 Ranking Parejas
        </h2>

        {ranking.parejas.length === 0 && (
          <p>
            Sin partidas todavía
          </p>
        )}

        {ranking.parejas.map(
          ([pareja, wins], i) => (

            <div
              key={i}
              className="ranking-item"
            >
              <span>
                #{i + 1} {pareja}
              </span>

              <strong>
                {wins} wins
              </strong>
            </div>
          )
        )}

      </div>

    </div>
  );
}