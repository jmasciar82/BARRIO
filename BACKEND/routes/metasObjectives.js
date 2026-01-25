import express from 'express';
import {
  getObjectives,
  createObjective,
  updateObjective
} from '../controllers/metasObjectives.controller.js';
import metasAuth from '../middlewares/metasAuth.middleware.js';

const router = express.Router();

// 👇 USAR EL NOMBRE CORRECTO
router.use(metasAuth);

router.get('/', getObjectives);
router.post('/', createObjective);
router.put('/:id', updateObjective);

export default router;
