import { prisma } from '../../src/config/db.server';
import { NewExercise, NewExerciseType } from '../../src/types/exercise';

export default async function seedExercises() {
  let bodyParts = await prisma.bodyPart.findMany();
  if (bodyParts.length === 0) {
    await Promise.all(
      getBodyParts().map(async (bodyPart) => {
        await prisma.bodyPart.create({
          data: {
            name: bodyPart,
          },
        });
      }),
    );
    console.log('Body parts seeded');
  }

  const exerciseTypes = await prisma.exerciseType.findMany();
  if (exerciseTypes.length === 0) {
    await Promise.all(
      getExerciseTypes().map(async (exerciseType, index) => {
        await prisma.exerciseType.create({
          data: {
            exerciseTypeId: index,
            name: exerciseType.name,
            hasReps: exerciseType.hasReps,
            hasSets: exerciseType.hasSets,
            hasWeights: exerciseType.hasWeights,
            hasTime: exerciseType.hasTime,
            isBreak: exerciseType.isBreak,
          },
        });
      }),
    );
    console.log('Exercise types seeded');
  }

  const exercises = await prisma.exercise.findMany();
  if (exercises.length === 0) {
    bodyParts = await prisma.bodyPart.findMany({
      select: {
        bodyPartId: true,
        name: true,
      },
    });
    await Promise.all(
      getExercises().map(async (exercise) => {
        await prisma.exercise.create({
          data: {
            exerciseTypeId: exercise.exerciseTypeId,
            name: exercise.name,
            description: exercise.description,
            exercisesBodyParts: {
              create: exercise.bodyParts.map((bodyPart) => {
                const dbBodyPart = bodyParts.find((bp) => bp.name === bodyPart);
                return {
                  bodyPartId: dbBodyPart?.bodyPartId || 1,
                };
              }),
            },
          },
        });
      }),
    );
    console.log('Exercises seeded');
  }
}

function getBodyParts(): string[] {
  return [
    'neck',
    'traps',
    'delts',
    'biceps',
    'triceps',
    'forearms',
    'pecs',
    'lats',
    'upper abs',
    'lower abs',
    'oblique',
    'quads',
    'back',
    'lower back',
    'glutes',
    'hams',
    'calves',
  ];
}

function getExerciseTypes(): NewExerciseType[] {
  return [
    {
      name: 'reps',
      hasReps: true,
      hasSets: true,
      hasWeights: false,
      hasTime: false,
      isBreak: false,
    },
    {
      name: 'time',
      hasReps: false,
      hasSets: true,
      hasWeights: false,
      hasTime: true,
      isBreak: false,
    },
    {
      name: 'break',
      hasReps: false,
      hasSets: false,
      hasWeights: false,
      hasTime: false,
      isBreak: true,
    },
    {
      name: 'weights',
      hasReps: true,
      hasSets: true,
      hasWeights: true,
      hasTime: false,
      isBreak: false,
    },
  ];
}

function getExercises(): NewExercise[] {
  return [
    {
      exerciseTypeId: 0,
      name: 'Push ups',
      description:
        'Push-ups are exercises to strengthen your arms and chest muscles. They are done by lying with your face towards the floor and pushing with your hands to raise your body until your arms are straight.',
      bodyParts: ['pecs', 'triceps'],
    },
    {
      exerciseTypeId: 0,
      name: 'Pull ups',
      description:
        'A pull-up is an upper-body strength exercise. The pull-up is a closed-chain movement where the body is suspended by the hands, gripping a bar or other implement at a distance typically wider than shoulder-width, and pulled up. As this happens, the elbows flex and the shoulders adduct and extend to bring the elbows to the torso.',
      bodyParts: ['lats', 'biceps'],
    },
    {
      exerciseTypeId: 0,
      name: 'Squats',
      description:
        'A squat is a strength exercise in which the trainee lowers their hips from a standing position and then stands back up. During the descent, the hip and knee joints flex while the ankle joint dorsiflexes; conversely the hip and knee joints extend and the ankle joint plantarflexes when standing up.',
      bodyParts: ['quads', 'glutes'],
    },
    {
      exerciseTypeId: 0,
      name: 'Deadlifts',
      description:
        'The deadlift is a movement in which your hips hinge backward to lower down and pick up a weighted barbell or kettlebell from the floor. Your back is flat throughout the movement. Some benefits of performing deadlifts include strengthening and gaining more definition in your upper and lower back, glutes, and hamstrings.',
      bodyParts: ['back', 'hams'],
    },
    {
      exerciseTypeId: 1,
      name: 'Plank',
      description:
        'The plank is an isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.',
      bodyParts: ['upper abs', 'lower abs'],
    },
    {
      exerciseTypeId: 1,
      name: 'Interval running',
      description:
        'Interval running is a type of training that involves a series of low- to high-intensity workouts interspersed with rest or relief periods. The high-intensity periods are typically at or close to anaerobic exercise, while the recovery periods involve activity of lower intensity. Varying the intensity of the exercise challenges the heart and lungs, which helps improve cardiovascular fitness.',
      bodyParts: ['quads', 'glutes'],
    },
    {
      exerciseTypeId: 2,
      name: 'Rest',
      description: 'Rest, because you and your muscles deserve it!',
      bodyParts: [],
    },
  ];
}
