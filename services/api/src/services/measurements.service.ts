import * as MesaurementsDB from '../persistance/measurements.db';

async function createMeasurement(
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
  return await MesaurementsDB.createMesaurement(
    userId,
    saveDate,
    weight,
    biceps,
    chest,
    waist,
    hips,
    thigh,
    calf,
  );
}

async function getMeasurements(userId: number) {
  return await MesaurementsDB.getMeasurements(userId);
}

async function getSelectedMeasurements(
  userId: number,
  selectedMeasurements: string[],
) {
  return await MesaurementsDB.getSelectedMeasurements(
    userId,
    selectedMeasurements,
  );
}

async function getMeasurementsSince(userId: number, timeInterval: number) {
  return await MesaurementsDB.getMeasurementsSince(userId, timeInterval);
}

async function getSelectedMeasurementsSince(
  userId: number,
  selectedMeasurements: string[],
  timeInterval: number,
) {
  return await MesaurementsDB.getSelectedMeasurementsSince(
    userId,
    selectedMeasurements,
    timeInterval,
  );
}

export {
  createMeasurement,
  getMeasurements,
  getSelectedMeasurements,
  getMeasurementsSince,
  getSelectedMeasurementsSince,
};
