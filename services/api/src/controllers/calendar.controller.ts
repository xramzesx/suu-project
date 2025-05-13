import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ReturnUser } from './user.controller';
import * as CalendarService from '../services/calendar.service';
import { NewCalendarEvent } from '../types/calendar';

const prepareDateInput = (dateStr: string) =>
  isNaN(+dateStr) ? dateStr : +dateStr;

async function getAllEventsInRange(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || -1;
    const { startDate, endDate } = req.params;

    const events = await CalendarService.getAllEventsInRange(
      userId,
      new Date(prepareDateInput(startDate)),
      new Date(prepareDateInput(endDate)),
    );

    res.status(200).send(events);
  } catch (error) {
    next(error);
  }
}

async function createEvent(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number((req.user as ReturnUser).userId) || -1;
    const { datetime, repeatFrequency, repeatUnit, repeatCount, workoutId } =
      req.body;

    const calendarEvent: NewCalendarEvent = {
      datetime,
      repeatFrequency,
      repeatUnit,
      repeatCount,
      workoutId,
    };

    await CalendarService.createEvent(userId, calendarEvent);

    res.status(201).send();
  } catch (error) {
    next(error);
  }
}

export { getAllEventsInRange, createEvent };
