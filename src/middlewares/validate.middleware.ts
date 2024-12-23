import { Request, Response, NextFunction } from "express";
import Joi from "joi";

/**
 * Função que valida um objeto JSON com base em um schema Joi.
 *
 * @param {Joi.ObjectSchema} schema - O schema Joi que ser  utilizado para a validacao
 * @returns {function} - Um middleware Express que valida o corpo da requisição com base no schema
 */
export const validate = (schema: Joi.ObjectSchema): any => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body, { abortEarly: false });

		if (error) {
			return res.status(400).json({
				//  Mensagem de erro para o usuario
				message: "Erro de validação",

				// Detalhes do erro. Um array de mensagens de erro
				details: error.details.map((err) => err.message),
			});
		}

		next();
	};
};
