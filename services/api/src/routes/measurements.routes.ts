import express from 'express';
import * as measurementsController from '../controllers/measurements.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post(
  '/create',
  authenticateToken,
  measurementsController.createMeasurement,
);
router.get('/all', authenticateToken, measurementsController.getMeasurements);
router.get(
  '/:selectedMeasurements',
  authenticateToken,
  measurementsController.getSelectedMeasurements,
);
router.get(
  '/all/:timeInterval',
  authenticateToken,
  measurementsController.getMesaurementsSince,
);
router.get(
  '/:selectedMeasurements/:timeInterval',
  authenticateToken,
  measurementsController.getSelectedMeasurementsSince,
);

export = router;
