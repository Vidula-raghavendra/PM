const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@orbit.com';
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            },
        });
        console.log('Admin user created:', user.email);
    } catch (e) {
        // If it fails, maybe role constraint? Try without role or minimal
        console.log('Retrying with minimal fields...');
        const user = await prisma.user.create({
            data: {
                email: 'admin-fallback@orbit.com',
                password: hashedPassword,
                name: 'Fallback Admin'
            }
        });
        console.log(user);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
