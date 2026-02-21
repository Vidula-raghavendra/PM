
import { UserService } from "../src/services/user.service";
import bcrypt from "bcryptjs";

async function main() {
    const email = 'admin@gmail.com';
    const password = 'password123';
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        // Check if admin exists first to avoid duplicate error if we run this multiple times
        const existing = await UserService.getByEmail(email);
        if (existing) {
            console.log(`Admin user already exists: ${existing.email}`);
            return;
        }

        const user = await UserService.create({
            email,
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            phone: '1234567890', // Default phone for admin
            gender: 'Other',
            sector: 'Technology',
            purpose: 'Administration'
        });
        console.log(`Admin user created: ${user.email}`);
    } catch (e) {
        console.error("Failed to create admin:", e);
    }
}

main();
