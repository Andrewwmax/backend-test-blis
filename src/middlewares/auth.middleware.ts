import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { isTokenBlacklisted } from "../utils/tokenBlacklist";

interface AuthenticatedRequest extends Request {
	user?: { id: string; name: string };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({ message: "Token não fornecido." });
		return;
	}

	const token = authHeader.split(" ")[1];

	if (isTokenBlacklisted(token)) {
		res.status(401).json({ message: "Token inválido ou expirado." });
		return;
	}

	try {
		const secret = process.env.JWT_SECRET as string;
		// jwt.verify(token, secret);

		const decoded = jwt.verify(token, secret) as {
			id: string;
			name: string;
		};
		// Anexa o user_id ao objeto req
		req.user = { id: decoded.id, name: decoded.name };

		// console.log("Logged pass");
		next();
	} catch (err) {
		res.status(401).json({ message: "Token inválido." });
	}
};
