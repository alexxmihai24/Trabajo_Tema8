import { users, events, eventImages } from './data.mjs';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const resetDatabase = async () => {
    console.log("Reiniciando base de datos (TRUNCATE)...");
    // PostgreSQL
    await prisma.$executeRaw`TRUNCATE TABLE "users", "events", "event_images" RESTART IDENTITY CASCADE;`;
}


async function main() {
    // PELIGRO: Borramos todo
    await resetDatabase()

    console.log("Añadiendo usuarios...")
    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("Añadiendo eventos...")
    await prisma.event.createMany({
        data: events,
        skipDuplicates: true,
    });

    console.log("Añadiendo imágenes...")
    await prisma.eventImage.createMany({
        data: eventImages,
        skipDuplicates: true,
    });

    console.log("Listo!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
