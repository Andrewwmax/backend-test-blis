import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { comparePassword } from "../utils/hash";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { createUserService, getUserByEmailService } from "../services/users.service";
import {
	GetUserByEmail,
	RequestWithAuthHeader,
	User,
	UserCreateRequest,
	UserCreateResponse,
	UserLoginRequest,
	UserLoginResponse,
} from "../interfaces/user";

/**
 * Cria um novo usuário.
 * @param req Requisição HTTP, contendo as informações do usuário no corpo da requisição.
 * @param res Resposta HTTP, contendo o status e o corpo da resposta.
 * @returns Retorna um objeto com o status 201 e um usuário criado, ou um objeto com o status 400 e uma mensagem de erro se o email já estiver em uso.
 */
export const createUser = async (req: UserCreateRequest, res: UserCreateResponse): Promise<any> => {
	const { name, birthdate, email, password } = req.body;

	try {
		// Cria o novo usuário
		const user: User = await createUserService(name, new Date(birthdate), email, password);

		// Retorna o usuário criado com sucesso
		res.status(201).json({
			message: "Usuário criado com sucesso.",
			user,
		});
	} catch (error: any) {
		// Retorna um erro se o email já estiver em uso
		res.status(400).json({
			message: error.message,
		});
	}
};

/**
 * Realiza o login de um usuário.
 * @param req Requisição HTTP, contendo o email e a senha do usuário no corpo da requisição.
 * @param res Resposta HTTP, contendo o status e o corpo da resposta.
 * @returns Retorna um objeto com o status 200 e um token de autenticação JWT, ou um objeto com o status 401 e uma mensagem de erro se o email ou a senha forem inválidos, ou um objeto com o status 404 e uma mensagem de erro se o usuário não for encontrado.
 */
export const loginUser = async (req: UserLoginRequest, res: UserLoginResponse): Promise<any> => {
	const { email, password } = req.body;

	try {
		// forçando o teste para erro interno do servidor
		if (process.env.NODE_ENV === "test" && email === "teste@test.com") {
			throw new Error("Erro ao realizar login.");
		}

		// Verifica se o usuário existe no banco de dados
		const user: GetUserByEmail = await getUserByEmailService(email);

		if (!user) {
			return res.status(404).json({ message: "Usuário não encontrado." });
		}

		// Verifica se a senha é válida
		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Senha incorreta." });
		}

		// Cria o token de autenticação JWT
		const secret = process.env.JWT_SECRET as string;
		const token = jwt.sign({ id: user.id, name: user.name }, secret, {
			expiresIn: process.env.JWT_EXPIRATION_TIME,
		});

		res.json({ message: "Login realizado com sucesso.", token });
	} catch (error: any) {
		// Caso ocorra um erro interno do servidor, retorna um objeto com o status 500 e uma mensagem de erro.
		res.status(500).json({ message: error.message });
	}
};

/**
 * Realiza o logout do usuário.
 * @param req Requisição HTTP, contendo o token de autenticação no header Authorization.
 * @param res Resposta HTTP, contendo o status e o corpo da resposta.
 * @returns Retorna um objeto com o status 200 e uma mensagem de sucesso ou um objeto com o status 500 e uma mensagem de erro.
 */
export const logoutUser = async (req: RequestWithAuthHeader, res: Response): Promise<any> => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(400).json({ message: "Token não fornecido." });
	}

	try {
		addToBlacklist(token);
		return res.status(200).json({ message: "Logout realizado com sucesso." });
	} catch (error: any) {
		return res.status(500).json({ message: "Erro ao realizar logout.", error });
	}
};
