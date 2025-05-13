import seedUsers from './exampleSeedData/user.prisma';
import seedExercises from './exampleSeedData/exersice.prisma';
import seedWorkouts from './exampleSeedData/workout.prisma';
import seedTags from './exampleSeedData/tag.prisma';
import seedScrappedData from './scrappedSeedData/scrapped.prisma';

async function seed() {
  await seedUsers();
  await seedTags();
  await seedExercises();
  await seedWorkouts();
  await seedScrappedData();

  console.log('Seeding completed ✅');
}

seed();
