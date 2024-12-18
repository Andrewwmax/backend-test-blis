import Joi from "joi";

export const allDocumentsSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1), // Página inicial é 1
	limit: Joi.number().integer().min(1).max(100).default(5), // Limite entre 1 e 100
});
