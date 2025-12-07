import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("adminpass", salt);
  const userPassword = await bcrypt.hash("userpass", salt);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
    },
  });

  const author1 = await prisma.author.upsert({
    where: { name: "Jane Austen" },
    update: {},
    create: { name: "Jane Austen", bio: "English novelist" },
  });

  const author2 = await prisma.author.upsert({
    where: { name: "George Orwell" },
    update: {},
    create: { name: "George Orwell", bio: "English novelist and essayist" },
  });

  await prisma.book.upsert({
    where: { title: "Pride and Prejudice" },
    update: {},
    create: {
      title: "Pride and Prejudice",
      authorId: author1.id,
      copies: 3,
      description: "A classic novel",
    },
  });

  await prisma.book.upsert({
    where: { title: "1984" },
    update: {},
    create: {
      title: "1984",
      authorId: author2.id,
      copies: 2,
      description: "Dystopian novel",
    },
  });

  console.log({ admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
