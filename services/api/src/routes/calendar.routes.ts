import express from 'express';
import * as calendarController from '../controllers/calendar.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, calendarController.createEvent);
router.get(
  '/grid/:startDate/:endDate',
  authenticateToken,
  calendarController.getAllEventsInRange,
);

export = router;
