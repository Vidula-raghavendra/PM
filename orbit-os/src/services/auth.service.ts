import { prisma } from "@/db/prisma";

export const AuthService = {
    async getByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email } });
    },

    async create(data: any) {
        return await prisma.user.create({ data });
    }
};
