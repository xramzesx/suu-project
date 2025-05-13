import * as CalendarDB from '../persistance/calendar.db';
import { NewCalendarEvent } from '../types/calendar';

async function getAllEventsInRange(
  userId: number,
  startDate: Date,
  endDate: Date,
) {
  const events = await CalendarDB.getAllEventsInRange(
    userId,
    startDate,
    endDate,
  );

  return events.map((item) => {
    const workout = item.calendarEventParent.workoutTemplate;
    return {
      eventId: item.eventId,
      parentId: item.parentId,
      datetime: item.datetime,
      workout: {
        workoutId: workout.workoutId,
        name: workout.name,
        level: workout.workoutLevel.name,
        tags: workout.workoutTags.map(({ tag }) => tag.name),
      },
    };
  });
}

async function createEvent(userId: number, calendarEvent: NewCalendarEvent) {
  return await CalendarDB.createEvent(userId, calendarEvent);
}
export { getAllEventsInRange, createEvent };
