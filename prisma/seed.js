const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  await prisma.booking.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.gymAddon.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database with simple IDs...');
  
  // 1. Create a gym owner user
  const owner = await prisma.user.create({
    data: {
      id: 'owner_1',
      clerkId: 'seed_owner_1',
      name: 'Gym Owner',
      email: 'owner@example.com',
      role: 'GYM_OWNER',
    },
  });

  // 2. Create Gym 1
  const gym1 = await prisma.gym.create({
    data: {
      id: "1",
      name: "Gold's Gym Indiranagar",
      description: "Premium fitness center with world-class equipment and personal training.",
      location: "Indiranagar, Bangalore",
      ownerId: owner.id,
      status: 'APPROVED',
      imageUrls: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop'],
    },
  });

  await prisma.plan.createMany({
    data: [
      { id: "p1", gymId: "1", type: "DAY", price: 299 },
      { id: "p2", gymId: "1", type: "WEEK", price: 1499 },
      { id: "p3", gymId: "1", type: "MONTH", price: 3999 },
    ]
  });

  // 3. Create Gym 2
  const gym2 = await prisma.gym.create({
    data: {
      id: "2",
      name: "Cult Fit HSR Layout",
      description: "Holistic fitness center offering group workouts and yoga.",
      location: "HSR Layout, Bangalore",
      ownerId: owner.id,
      status: 'APPROVED',
      imageUrls: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'],
    },
  });

  await prisma.plan.createMany({
    data: [
      { id: "p4", gymId: "2", type: "DAY", price: 199 },
      { id: "p5", gymId: "2", type: "WEEK", price: 999 },
      { id: "p6", gymId: "2", type: "MONTH", price: 2499 },
    ]
  });

  // 4. Create Gym 3
  const gym3 = await prisma.gym.create({
    data: {
      id: "3",
      name: "Power House Gym",
      description: "Hardcore bodybuilding gym for serious enthusiasts.",
      location: "Koramangala, Bangalore",
      ownerId: owner.id,
      status: 'APPROVED',
      imageUrls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'],
    },
  });

  await prisma.plan.createMany({
    data: [
      { id: "p7", gymId: "3", type: "DAY", price: 150 },
      { id: "p8", gymId: "3", type: "WEEK", price: 700 },
      { id: "p9", gymId: "3", type: "MONTH", price: 1800 },
    ]
  });

  console.log('Seeding complete with IDs 1, 2, 3!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
