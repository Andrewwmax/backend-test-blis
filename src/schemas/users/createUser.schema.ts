import Joi from "joi";

export const createUserSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	birthdate: Joi.date().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(10).max(30).required(),
});
