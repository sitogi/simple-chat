import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPass = await bcrypt.hash('veryLongLongPass', 10);

  const takano = await prisma.user.upsert({
    where: { email: 'takano@example.com' },
    update: {
      name: 'takano',
      password: hashedPass,
    },
    create: {
      email: 'takano@example.com',
      name: 'takano',
      password: hashedPass,
    },
  });

  const jiro = await prisma.user.upsert({
    where: { email: 'jiro@example.com' },
    update: {
      name: 'takano',
      password: hashedPass,
    },
    create: {
      email: 'jiro@example.com',
      name: 'jiro',
      password: hashedPass,
    },
  });

  console.log({ takano, jiro });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
