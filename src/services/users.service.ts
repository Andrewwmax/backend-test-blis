import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

export const createUserService = async (name: string, birthdate: Date, email: string, password: string) => {
	// Verifica se o email já está em uso
	const existingUser = await prisma.users.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("Email já está em uso.");
	}

	// Criptografa a senha
	const hashedPassword = await hashPassword(password);

	// Cria o usuário
	return prisma.users.create({
		data: { name, birthdate, email, password: hashedPassword },
	});
};

export const getUserByEmailService = async (email: string) => {
	return prisma.users.findUnique({ where: { email } });
};

// export const createUserDocumentService = async (name: string, user_id: string, filePath: string) => {
// 	return prisma.userDocuments.create({
// 		data: {
// 			name,
// 			url: filePath,
// 			user_id,
// 		},
// 	});
// };
