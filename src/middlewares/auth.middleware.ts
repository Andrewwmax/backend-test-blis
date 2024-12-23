import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

import { isTokenBlacklisted } from "../utils/tokenBlacklist";
import { AuthenticatedRequest } from "../interfaces/authentication";

/**
 * Middleware de autenticação de usuário
 * @param req - Requisição HTTP com o token no header Authorization
 * @param res - Resposta HTTP
 * @param next - Função next para prosseguir com a execução do middleware
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	// Verifica se o token foi enviado no header Authorization
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({ message: "Token não fornecido." });
		return;
	}

	// Extrai o token do header Authorization
	const token = authHeader.split(" ")[1];

	//  Verifica se o token está na lista de tokens inválidos
	if (isTokenBlacklisted(token)) {
		res.status(401).json({ message: "Token inválido ou expirado." });
		return;
	}

	try {
		// Verifica se o token é válido e extrai o user_id dele
		const secret = process.env.JWT_SECRET as string;
		const decoded = jwt.verify(token, secret) as {
			id: string;
			name: string;
		};

		// Anexa o user_id ao objeto req
		req.user = { id: decoded.id, name: decoded.name };

		// Prossegue com a execução do middleware
		next();
	} catch (err) {
		// Retorna erro 401 se o token for inválido
		res.status(401).json({ message: "Token inválido." });
	}
};
