import { prisma } from '../../src/config/db.server';
import { NewUser } from '../../src/types/user';
import bcrypt from 'bcrypt';

export default async function seedTags() {
  const currentUsers = await prisma.appUser.findMany();
  if (currentUsers.length === 0) {
    await Promise.all(
      getExampleUsers().map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.appUser.create({
          data: {
            username: user.username,
            email: user.email,
            passwordHash: hashedPassword,
            gender: 'M',
            description: user?.description || null,
          },
        });
      }),
    );
    console.log('Users seeded');
  }
}

function getExampleUsers(): Array<NewUser> {
  return [
    {
      username: 'devUser',
      email: 'test@test.pl',
      password: 'test',
    },
    {
      username: 'pigeon64',
      email: 'test2@test.pl',
      password: 'test',
      description: 'My dream is to lift 150kg',
    },
    {
      username: 'pepe',
      email: 'test3@test.pl',
      password: 'test',
    },
    {
      username: 'admin',
      email: 'admin@gymu.com',
      password: 'admin',
    },
  ];
}
