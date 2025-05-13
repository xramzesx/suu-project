import { prisma } from '../../src/config/db.server';

export default async function seedTags() {
  const tags = await prisma.tag.findMany();
  if (tags.length === 0) {
    await Promise.all(
      getExampleTags().map(async (tag) => {
        await prisma.tag.create({
          data: {
            name: tag,
          },
        });
      }),
    );
    console.log('Tags seeded');
  }

  const workoutLevels = await prisma.workoutLevel.findMany();
  if (workoutLevels.length === 0) {
    await Promise.all(
      getWorkoutLevels().map(async (level, index) => {
        await prisma.workoutLevel.create({
          data: {
            name: level,
            levelId: index,
          },
        });
      }),
    );
    console.log('Workout levels seeded');
  }
}

function getExampleTags() {
  return [
    'Arms',
    'Legs',
    'Back',
    'Chest',
    'Shoulders',
    'Core',
    'FBW',
    'Upper body',
    'Lower body',
    'Cardio',
    'Strength',
    'Endurance',
  ];
}

function getWorkoutLevels(): string[] {
  return ['beginner', 'easy', 'medium', 'hard', 'hardcore'];
}
