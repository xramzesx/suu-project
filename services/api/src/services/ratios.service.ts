import * as UserDB from '../persistance/user.db';
import * as MeasurementDB from '../persistance/measurements.db';

const getHeight = async (userId: number) =>
  (await UserDB.getUserHeight(userId))?.height ?? null;

const getWeight = async (userId: number) => {
  const weightData = await MeasurementDB.getSelectedMeasurements(userId, [
    'weight',
  ]);

  return weightData.length === 0
    ? null
    : weightData[weightData.length - 1].weight;
};

const getGender = async (userId: number) =>
  (await UserDB.getGender(userId))?.gender ?? null;

async function calculateBMI(userId: number) {
  const height = await getHeight(userId);
  const weight = await getWeight(userId);

  if (!height || !weight) {
    return -1;
  }

  const heightInMeters = height / 100;

  return weight / (heightInMeters * heightInMeters);
}

async function calculateWHR(userId: number) {
  const data = await MeasurementDB.getSelectedMeasurements(userId, [
    'waist',
    'hips',
  ]);

  if (data.length === 0) {
    return -1;
  }

  const { waist, hips } = data[data.length - 1];

  return waist / hips;
}

async function calculateWHtR(userId: number) {
  const height = await getHeight(userId);
  const waistData = await MeasurementDB.getSelectedMeasurements(userId, [
    'waist',
  ]);

  if (!height || waistData.length === 0) {
    return -1;
  }

  const waist = waistData[waistData.length - 1].waist;

  return waist / height;
}

async function calculateBrocaIndex(userId: number) {
  const height = await getHeight(userId);

  if (!height) {
    return -1;
  }

  return height - 100;
}

async function calculateLBM(userId: number) {
  const height = await getHeight(userId);
  const weight = await getWeight(userId);
  const gender = await getGender(userId);

  if (!height || !weight || !gender) {
    return -1;
  }

  return gender === 'M'
    ? 0.3281 * weight + 0.33929 * height - 29.5336
    : 0.29569 * weight + 0.41813 * height - 43.2933;
}

async function calculateBMR(userId: number) {
  const LBM = await calculateLBM(userId);

  return LBM !== -1 ? 500 + 22 * LBM : -1;
}

export {
  calculateBMI,
  calculateWHR,
  calculateWHtR,
  calculateBrocaIndex,
  calculateLBM,
  calculateBMR,
};
