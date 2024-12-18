import Joi from "joi";

export const editAbilitySchema = Joi.object({
	id: Joi.string().uuid().required(),
	active: Joi.boolean().required(),
});
