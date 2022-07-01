/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //seed user messages
  const firstUserMessageID = 'e3dced88-d8b5-48b8-8b58-742af5a5e9c4';
  await prisma.message.deleteMany();
  await prisma.message.upsert({
    where: { id: firstUserMessageID },
    create: {
      text: 'this is the first post for TEST',
      user: 'TEST',
    },
    update: {},
  });
  //...
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
