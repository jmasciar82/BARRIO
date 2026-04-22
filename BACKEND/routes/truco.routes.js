import express from 'express';
import TrucoPartida from '../models/TrucoPartida.js';

const router = express.Router();

/* GUARDAR PARTIDA */
router.post('/', async (req, res) => {
  try {
    const partida = new TrucoPartida(req.body);
    await partida.save();
    res.json(partida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar partida' });
  }
});

/* OBTENER HISTORIAL */
router.get('/', async (req, res) => {
  try {
    const partidas = await TrucoPartida
      .find()
      .sort({ fecha: -1 });

    res.json(partidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener partidas' });
  }
});

/* BORRAR */
router.delete('/:id', async (req, res) => {
  try {
    await TrucoPartida.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al borrar partida' });
  }
});

export default router;
