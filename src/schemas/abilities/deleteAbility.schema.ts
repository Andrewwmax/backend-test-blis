import Joi from "joi";

export const deleteUserAbilitiesSchema = Joi.object({
	ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
