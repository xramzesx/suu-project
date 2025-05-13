import { TimeUnit } from '@prisma/client';
import { prisma } from '../config/db.server';
import { NewCalendarEvent } from '../types/calendar';
import { add } from 'date-fns';

type PluralTimeUnit = 'days' | 'weeks' | 'months';

const timeUnitMapper = new Map<TimeUnit, PluralTimeUnit>([
  ['day', 'days'],
  ['week', 'weeks'],
  ['month', 'months'],
]);

const getNextDate = (datetime: Date, frequency: number, unit: TimeUnit) => {
  const mappedUnit: PluralTimeUnit = timeUnitMapper.get(unit)!;
  return add(datetime, { [mappedUnit]: frequency });
};

async function getAllEventsInRange(
  userId: number,
  startDate: Date,
  endDate: Date,
) {
  return await prisma.calendarEvent.findMany({
    where: {
      datetime: {
        gte: startDate,
        lte: endDate,
      },
      calendarEventParent: {
        userId: userId,
      },
    },
    orderBy: {
      datetime: 'desc',
    },
    include: {
      calendarEventParent: {
        include: {
          workoutTemplate: {
            include: {
              workoutLevel: true,
              workoutTags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function createEvent(userId: number, calendarEvent: NewCalendarEvent) {
  return await prisma.$transaction(async (tx) => {
    const eventParent = await tx.calendarEventParent.create({
      data: {
        userId: userId,
        workoutId: calendarEvent.workoutId,
        repeatCount: calendarEvent.repeatCount,
        repeatFrequency: calendarEvent.repeatFrequency,
        repeatUnit: calendarEvent.repeatUnit,
      },
    });

    const parentId = eventParent.parentId;
    const events = [];

    let currentDate = calendarEvent.datetime;

    for (let i = 0; i <= calendarEvent.repeatCount; i++) {
      const event = {
        parentId: parentId,
        datetime: currentDate,
      };

      events.push(event);

      currentDate = getNextDate(
        currentDate,
        calendarEvent.repeatFrequency,
        calendarEvent.repeatUnit,
      );
    }

    const createdEvents = await tx.calendarEvent.createManyAndReturn({
      data: events,
    });

    return {
      eventParent,
      events: createdEvents,
    };
  });
}

export { getAllEventsInRange, createEvent };
