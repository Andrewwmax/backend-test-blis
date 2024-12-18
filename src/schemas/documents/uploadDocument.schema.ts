import Joi from "joi";

/**
 * @deprecated
 * sem necessidade de validação para o nome,
 * simplesmente utilize o nome do arquivo
 */
export const uploadDocumentSchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),
});
