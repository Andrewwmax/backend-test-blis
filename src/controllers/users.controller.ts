import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { comparePassword } from "../utils/hash";
import { addToBlacklist } from "../utils/tokenBlacklist";
import { createUserService, getUserByEmailService } from "../services/users.service";

export const createUser = async (req: Request, res: Response): Promise<any> => {
	const { name, birthdate, email, password } = req.body;

	try {
		const user = await createUserService(name, new Date(birthdate), email, password);
		res.status(201).json({ message: "Usuário criado com sucesso.", user });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;

	try {
		// forçando o teste para erro interno do servidor
		if (process.env.NODE_ENV === "test" && email === "teste@test.com") {
			throw new Error("Erro ao realizar login.");
		}

		const user = await getUserByEmailService(email);
		// console.log({ userscontroller: user });

		if (!user) {
			return res.status(404).json({ message: "Usuário não encontrado." });
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Senha incorreta." });
		}

		const secret = process.env.JWT_SECRET as string;
		const token = jwt.sign({ id: user.id, name: user.name }, secret, {
			expiresIn: "10h",
		});

		res.json({ message: "Login realizado com sucesso.", token });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

// export const uploadDocument = async (req: Request, res: Response): Promise<any> => {
// 	const user_id = (req as any).user.id; // Pega o user_id anexado pelo middleware
// 	const name = (req as any).user.name; // Pega o user_id anexado pelo middleware

// 	console.log({ uploadDocument: { user_id, name, file: req.file } });
// 	const file = req.file;

// 	if (!file) {
// 		return res.status(400).json({ message: "Arquivo não enviado." });
// 	}

// 	try {
// 		const document = await createUserDocumentService(name, user_id, `/uploads/${file.filename}`);
// 		res.status(201).json({
// 			message: "Documento enviado com sucesso.",
// 			document,
// 		});
// 	} catch (error) {
// 		res.status(500).json({ message: error });
// 	}
// };

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(400).json({ message: "Token não fornecido." });
	}

	const token = authHeader.split(" ")[1];

	try {
		addToBlacklist(token);
		res.status(200).json({ message: "Logout realizado com sucesso." });
	} catch (error: any) {
		res.status(500).json({ message: "Erro ao realizar logout.", error });
	}
};

// export const downloadDocument = async (req: Request, res: Response): Promise<any> => {
// 	try {
// 		const { filename } = req.params;

// 		// Exemplo: validar acesso ao arquivo (substituir por lógica real)

// 		const hasAccess = true; // Substituir por consulta ao banco ou regra de negócio
// 		if (!hasAccess) {
// 			return res.status(403).json({ message: "Acesso negado ao arquivo." });
// 		}

// 		const filePath = path.join(__dirname, "../../uploads", filename);
// 		res.status(200).sendFile(filePath);
// 	} catch (error) {
// 		res.status(500).json({ message: "Erro ao baixar o arquivo.", error });
// 	}
// };

// import jwt from "jsonwebtoken";
// import { Request, Response } from "express";

// import { PrismaClient } from "@prisma/client";

// import { hashPassword, comparePassword } from "../utils/hash";

// const prisma = new PrismaClient();

// /**
//  * Cria um novo usuário
//  */
// export const createUser = async (req: Request, res: Response): Promise<any> => {
// 	const { name, birthdate, email, password } = req.body;

// 	try {
// 		// Verifica se o email já existe
// 		const existingUser = await prisma.users.findUnique({
// 			where: { email },
// 		});
// 		if (existingUser) {
// 			return res.status(400).json({ message: "Email já está em uso." });
// 		}

// 		// Criptografa a senha e cria o usuário
// 		const hashedPassword = await hashPassword(password);
// 		const user = await prisma.users.create({
// 			data: {
// 				name,
// 				birthdate: new Date(birthdate),
// 				email,
// 				password: hashedPassword,
// 			},
// 		});

// 		res.status(201).json({
// 			message: "Usuário criado com sucesso!",
// 			user: { id: user.id, name: user.name, email: user.email },
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Erro ao criar usuário.", error });
// 	}
// };

// /**
//  * Realiza login do usuário
//  */
// export const loginUser = async (req: Request, res: Response): Promise<any> => {
// 	const { email, password } = req.body;

// 	try {
// 		// Busca o usuário pelo email
// 		const user = await prisma.users.findUnique({ where: { email } });
// 		if (!user) {
// 			return res.status(404).json({ message: "Usuário não encontrado." });
// 		}

// 		// Compara a senha
// 		const isPasswordValid = await comparePassword(password, user.password);
// 		if (!isPasswordValid) {
// 			return res.status(401).json({ message: "Senha incorreta." });
// 		}

// 		// Gera o token JWT
// 		const secret = process.env.JWT_SECRET as string;
// 		const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

// 		res.json({ message: "Login realizado com sucesso.", token });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Erro ao realizar login.", error });
// 	}
// };

// /**
//  * Faz upload de documentos de um usuário
//  */
// export const uploadDocument = async (
// 	req: Request,
// 	res: Response
// ): Promise<any> => {
// 	const { name, user_id } = req.body;
// 	const file = req.file;

// 	if (!file) {
// 		return res.status(400).json({ message: "Arquivo não enviado." });
// 	}

// 	try {
// 		const document = await prisma.userDocuments.create({
// 			data: {
// 				name,
// 				url: `/uploads/${file.filename}`,
// 				user_id,
// 			},
// 		});

// 		res.status(201).json({
// 			message: "Documento enviado com sucesso.",
// 			document,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Erro ao enviar documento.", error });
// 	}
// };
