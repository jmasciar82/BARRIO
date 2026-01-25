import { useEffect, useState } from 'react';
import axios from '../axios';
import MetaForm from './MetaForm';
import MetaItem from './MetaItem';
import './Dashboard.css';

const Dashboard = () => {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetas = async () => {
    try {
      const res = await axios.get('/metas/objetivos');
      setMetas(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las metas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleAdd = (nuevaMeta) => {
    setMetas((prev) => [nuevaMeta, ...prev]);
  };

  const handleUpdate = (metaActualizada) => {
    setMetas((prev) =>
      prev.map((m) => (m._id === metaActualizada._id ? metaActualizada : m))
    );
  };

  const handleDelete = (id) => {
    setMetas((prev) => prev.filter((m) => m._id !== id));
  };

  if (loading) return <p>Cargando metas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard">
      <h2>📌 Mis Metas</h2>

      {/* Formulario para crear nueva meta */}
      <MetaForm onAdd={handleAdd} />

      {/* Lista tipo Kanban */}
      <div className="metas-grid">
        {metas.length === 0 && <p>No hay metas creadas</p>}
        {metas.map((meta) => (
          <MetaItem
            key={meta._id}
            meta={meta}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
