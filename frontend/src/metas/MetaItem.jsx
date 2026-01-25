import { useState } from 'react';
import axios from '../axios';
import './MetaItem.css';

const MetaItem = ({ meta, onUpdate, onDelete }) => {
  const [edit, setEdit] = useState(false);
  const [nombre, setNombre] = useState(meta.nombre);
  const [categoria, setCategoria] = useState(meta.categoria || '');
  const [peso, setPeso] = useState(meta.peso || '');

  const handleSave = async () => {
    try {
      const res = await axios.put(`/metas/objetivos/${meta._id}`, {
        nombre,
        categoria,
        peso,
      });
      onUpdate(res.data);
      setEdit(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar meta');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta meta?')) return;

    try {
      await axios.delete(`/metas/objetivos/${meta._id}`);
      onDelete(meta._id);
    } catch (err) {
      console.error(err);
      alert('Error al eliminar meta');
    }
  };

  return (
    <div className="meta-card">
      {edit ? (
        <>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
          />
          <div className="meta-actions">
            <button onClick={handleSave}>💾 Guardar</button>
            <button onClick={() => setEdit(false)}>❌ Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h3>{nombre}</h3>
          <p>Categoria: {categoria}</p>
          <p>Peso: {peso}</p>
          <div className="meta-actions">
            <button onClick={() => setEdit(true)}>✏️ Editar</button>
            <button onClick={handleDelete}>🗑️ Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MetaItem;
