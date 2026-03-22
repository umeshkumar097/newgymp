const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "info@aiclex.in";
  const password = "Umesh@2003##";
  
  console.log(`Setting up Admin: ${email}`);
  
  const user = await prisma.user.upsert({
    where: { email: email },
    update: { 
      password: password, 
      role: 'ADMIN',
      name: 'Super Admin'
    },
    create: {
      email: email,
      password: password,
      name: 'Super Admin',
      role: 'ADMIN',
      clerkId: `admin_${Date.now()}`
    }
  });
  
  console.log('✅ Admin User created/updated successfully');
  await prisma.$disconnect();
}

main().catch(console.error);
