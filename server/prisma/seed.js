require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@shootdelight.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME || "Shoot Delight Admin";

  const hashed = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { name, email, password: hashed, role: "SUPERADMIN" },
  });

  console.log(`Admin ready: ${admin.email} (change the password after first login!)`);

  // A few starter services so the site isn't empty on first run

  //for (const s of services) {
    //await prisma.service.upsert({ where: { title: s.title }, update: {}, create: s }).catch(async () => {
      // title has no unique constraint by default; fall back to findFirst + create
      //const exists = await prisma.service.findFirst({ where: { title: s.title } });
      //if (!exists) await prisma.service.create({ data: s });
    //});
  //}


  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
