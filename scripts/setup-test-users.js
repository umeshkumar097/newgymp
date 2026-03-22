const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- CREATING TEST CREDENTIALS ---');

  // 1. ADMIN USER
  const admin = await prisma.user.upsert({
    where: { phone: '0000000000' },
    update: { role: 'ADMIN', name: 'Super Admin', email: 'admin@passfit.in' },
    create: {
      phone: '0000000000',
      clerkId: 'test_admin_id',
      name: 'Super Admin',
      email: 'admin@passfit.in',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin User: 0000000000');

  // 2. GYM OWNER
  const owner = await prisma.user.upsert({
    where: { phone: '1111111111' },
    update: { role: 'GYM_OWNER', name: 'Pro Gym Owner', email: 'owner@passfit.in' },
    create: {
      phone: '1111111111',
      clerkId: 'test_owner_id',
      name: 'Pro Gym Owner',
      email: 'owner@passfit.in',
      role: 'GYM_OWNER'
    }
  });
  console.log('✅ Gym Owner: 1111111111');

  console.log('\n--- USE OTP: 1111 FOR BOTH ---');
  await prisma.$disconnect();
}

main().catch(console.error);
