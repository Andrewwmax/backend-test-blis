import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import { GetUserByEmail, User } from "../interfaces/user";

const prisma = new PrismaClient();

/**
 * Cria um novo usu rio no banco de dados.
 *
 * @param {string} name - O nome do usuário.
 * @param {Date} birthdate - A data de nascimento do usuário.
 * @param {string} email - O email do usuário, usado para login e deve ser único.
 * @param {string} password - A senha bruta do usuário para ser criptografada antes de ser salva.
 *
 * @throws {Error} Se o email já está em uso.
 *
 * @returns {Promise<User>} O objeto do usuário criado.
 */
export const createUserService = async (
	name: string,
	birthdate: Date,
	email: string,
	password: string
): Promise<User> => {
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

/**
 * Busca um usuário pelo seu email.
 * @param email Email do usuário a ser buscado.
 * @returns Um objeto com as informações do usuário, ou null se não encontrado.
 */
export const getUserByEmailService = async (email: string): Promise<GetUserByEmail> => {
	return prisma.users.findUnique({ where: { email } });
};
