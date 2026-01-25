import { useState } from 'react';
import axios from '../axios';
import './MetaForm.css';

const MetaForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [peso, setPeso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/metas/objetivos', {
        nombre,
        categoria,
        peso,
      });
      onAdd(res.data);
      setNombre('');
      setCategoria('');
      setPeso('');
    } catch (err) {
      console.error(err);
      alert('Error al crear meta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="meta-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre de la meta"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />
      <input
        type="number"
        placeholder="Peso"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Agregar Meta'}
      </button>
    </form>
  );
};

export default MetaForm;
