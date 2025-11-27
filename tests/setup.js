const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up database before tests
  await prisma.contact.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.coupon.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Make prisma available globally in tests
global.prisma = prisma;
