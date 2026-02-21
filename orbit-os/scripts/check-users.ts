
import { UserService } from "../src/services/user.service";

async function main() {
    try {
        const users = await UserService.getAll();
        console.log("Users in DB:", users);
    } catch (e) {
        console.error("Failed to list users:", e);
    }
}

main();
