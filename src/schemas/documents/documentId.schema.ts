import Joi from "joi";

/**
 * @deprecated
 * fileId é requisitado como query na url.
 */
export const documentIdSchema = Joi.object({
	fileId: Joi.string().uuid().required(),
});
