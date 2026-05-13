import "../styles/marcador.css";

export default function Cuadrado({
  valor,
  color = "white"
}) {

  return (
    <div className="square">

      {valor >= 1 && (
        <div
          className="line left"
          style={{
            backgroundColor: color
          }}
        />
      )}

      {valor >= 2 && (
        <div
          className="line top"
          style={{
            backgroundColor: color
          }}
        />
      )}

      {valor >= 3 && (
        <div
          className="line right"
          style={{
            backgroundColor: color
          }}
        />
      )}

      {valor >= 4 && (
        <div
          className="line bottom"
          style={{
            backgroundColor: color
          }}
        />
      )}

      {valor === 5 && (
        <div
          className="diagonal"
          style={{
            backgroundColor: color
          }}
        />
      )}

    </div>
  );
}