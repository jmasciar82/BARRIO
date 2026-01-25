import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [metas, setMetas] = useState([]);
  const [registros, setRegistros] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const hoy = new Date().toISOString().slice(0, 10);

  const fetchMetas = async () => {
    const res = await fetch('http://localhost:5075/api/metas/objetivos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  };

  const fetchRegistros = async () => {
    const res = await fetch('http://localhost:5075/api/metas/registros/hoy', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    // convertir a mapa: { objetivoId: estado }
    const map = {};
    data.forEach(r => {
      map[r.objetivoId] = r.estado;
    });

    return map;
  };

  const cargarTodo = async () => {
    const [m, r] = await Promise.all([
      fetchMetas(),
      fetchRegistros()
    ]);

    setMetas(m);
    setRegistros(r);
    setLoading(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const guardarEstado = async (objetivoId, estado) => {
    await fetch('http://localhost:5075/api/metas/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        objetivoId,
        estado,
        fecha: hoy
      })
    });

    setRegistros(prev => ({
      ...prev,
      [objetivoId]: estado
    }));
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Seguimiento diario</h2>

      {metas.length === 0 && <p>No tenés metas</p>}

      {metas.map(meta => (
        <div
          key={meta._id}
          style={{
            border: '1px solid #ccc',
            padding: 10,
            marginBottom: 10
          }}
        >
          <strong>{meta.nombre}</strong>

          <div style={{ marginTop: 8 }}>
            {['hecho', 'parcial', 'no_hecho'].map(op => (
              <button
                key={op}
                onClick={() => guardarEstado(meta._id, op)}
                style={{
                  marginRight: 6,
                  background:
                    registros[meta._id] === op ? '#4caf50' : '#eee'
                }}
              >
                {op === 'hecho' && '✅'}
                {op === 'parcial' && '🟡'}
                {op === 'no_hecho' && '❌'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
