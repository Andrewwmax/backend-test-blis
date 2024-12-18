import Joi from "joi";

export const assignAbilitySchema = Joi.object({
	user_id: Joi.string().uuid().required(),
	ability_id: Joi.string().uuid().required(),
	years_experience: Joi.number().integer().min(0).required(),
});
