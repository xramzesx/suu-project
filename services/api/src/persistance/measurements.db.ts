import { prisma } from '../config/db.server';

function getSelectData(measurements?: string[]) {
  return {
    userId: true,
    saveDate: true,
    weight: measurements?.includes('weight') ?? true,
    biceps: measurements?.includes('biceps') ?? true,
    chest: measurements?.includes('chest') ?? true,
    waist: measurements?.includes('waist') ?? true,
    hips: measurements?.includes('hips') ?? true,
    thigh: measurements?.includes('thigh') ?? true,
    calf: measurements?.includes('calf') ?? true,
  };
}

async function createMesaurement(
  userId: number,
  saveDate: Date,
  weight: number,
  biceps: number,
  chest: number,
  waist: number,
  hips: number,
  thigh: number,
  calf: number,
) {
  const newMeasurement = await prisma.measurement.create({
    data: {
      userId,
      saveDate,
      weight,
      biceps,
      chest,
      waist,
      hips,
      thigh,
      calf,
    },
  });

  return newMeasurement;
}

async function getMeasurements(userId: number) {
  const measurements = await prisma.measurement.findMany({
    select: {
      ...getSelectData(),
    },
    where: {
      userId: userId,
    },
  });

  return measurements;
}

async function getSelectedMeasurements(
  userId: number,
  selectedMeasurements: string[],
) {
  const measurements = await prisma.measurement.findMany({
    select: {
      ...getSelectData(selectedMeasurements),
    },
    where: {
      userId: userId,
    },

    orderBy: {
      saveDate: 'asc',
    },
  });

  return measurements;
}

async function getMeasurementsSince(userId: number, timeInterval: number) {
  const measurements = await prisma.measurement.findMany({
    select: {
      ...getSelectData(),
    },
    where: {
      userId: userId,
      saveDate: {
        gte: new Date(
          new Date().setMonth(new Date().getMonth() - timeInterval),
        ),
      },
    },
    orderBy: {
      saveDate: 'asc',
    },
  });

  return measurements;
}

async function getSelectedMeasurementsSince(
  userId: number,
  selectedMeasurements: string[],
  timeInterval: number,
) {
  const measurements = await prisma.measurement.findMany({
    select: {
      ...getSelectData(selectedMeasurements),
    },
    where: {
      userId: userId,
      saveDate: {
        gte: new Date(
          new Date().setMonth(new Date().getMonth() - timeInterval),
        ),
      },
    },
    orderBy: {
      saveDate: 'asc',
    },
  });

  return measurements;
}

export {
  createMesaurement,
  getMeasurements,
  getSelectedMeasurements,
  getMeasurementsSince,
  getSelectedMeasurementsSince,
};
