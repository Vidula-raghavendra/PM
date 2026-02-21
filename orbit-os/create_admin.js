const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gmail.com';
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
                role: 'ADMIN',
                phone: '1234567890',
                gender: 'Other',
                sector: 'Technology',
                purpose: 'Administration'
            },
        });
        console.log(`User created: ${user.email}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
