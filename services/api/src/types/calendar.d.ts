import { TimeUnit } from '@prisma/client';

type NewCalendarEvent = {
  datetime: Date;
  repeatFrequency: number;
  repeatUnit: TimeUnit;
  repeatCount: number;
  workoutId: number;
};
