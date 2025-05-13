import express from 'express';
import * as ratiosController from '../controllers/ratios.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/bmi', authenticateToken, ratiosController.calculateBMI);
router.get('/whr', authenticateToken, ratiosController.calculateWHR);
router.get('/whtr', authenticateToken, ratiosController.calculateWHtR);
router.get(
  '/brocaIndex',
  authenticateToken,
  ratiosController.calculateBrocaIndex,
);
router.get('/lbm', authenticateToken, ratiosController.calculateLBM);
router.get('/bmr', authenticateToken, ratiosController.calculateBMR);

export = router;
