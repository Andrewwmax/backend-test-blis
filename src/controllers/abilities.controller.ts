import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
	createAbilityService,
	updateAbilityStatusService,
	deleteUserAbilitiesService,
	listUserAbilitiesService,
	assignAbilityToUserService,
} from "../services/abilities.service";

const prisma = new PrismaClient();

export const createAbility = async (req: Request, res: Response) => {
	const { name } = req.body;

	try {
		const ability = await createAbilityService(name);

		res.status(201).json({
			message: "Habilidade criada com sucesso.",
			ability,
		});
	} catch (error) {
		// console.error(error);
		res.status(500).json({ message: "Erro ao criar habilidade.", error });
	}
};

/**
 * Edita uma habilidade (ativa ou desativa)
 */
export const updateAbility = async (req: Request, res: Response) => {
	const { id, active } = req.body;

	try {
		const ability = await updateAbilityStatusService(id, active);

		res.status(200).json({
			message: "Habilidade atualizada com sucesso.",
			ability,
		});
	} catch (error) {
		// console.error(error);
		res.status(400).json({
			message: "Erro ao atualizar habilidade.",
			error,
		});
	}
};

/**
 * Relaciona uma habilidade a um usuário
 */
export const assignAbility = async (req: Request, res: Response): Promise<any> => {
	const { user_id, ability_id, years_experience } = req.body;

	try {
		// Verifica se a habilidade está ativa
		await assignAbilityToUserService(user_id, ability_id, years_experience);

		const userAbility = await prisma.usersAbilities.findFirst({
			where: { user_id, ability_id },
		});

		res.status(201).json({
			message: "Habilidade relacionada ao usuário com sucesso.",
			userAbility,
		});
	} catch (error: any) {
		// console.error(error);
		res.status(400).json({
			error: error.message,
		});
	}
};

/**
 * Remove uma habilidade relacionada a um usuário
 * Exemplo de requisição:
 * {
 *  "ids": ["1", "2", "3"]
 * }
 */
export const deleteAbilities = async (req: Request, res: Response) => {
	const { ids } = req.body;

	try {
		await deleteUserAbilitiesService(ids);

		res.status(200).json({ message: "Habilidade(s) removida(s) com sucesso." });
	} catch (error: any) {
		// console.error(error);
		res.status(400).json({ error: error.message });
	}
};

export const listUserAbilities = async (req: Request, res: Response) => {
	const { user_id, page = 1, limit = 10 } = req.query;

	try {
		const abilities = await listUserAbilitiesService(String(user_id), Number(page), Number(limit));

		res.status(200).json({
			message: "Habilidades do usuário listadas com sucesso.",
			abilities,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Erro ao listar habilidades do usuário.",
			error,
		});
	}
};

export const listAbilities = async (req: Request, res: Response) => {
	const { page = 1, limit = 10 } = req.query;

	try {
		const abilities = await listUserAbilitiesService("all", Number(page), Number(limit));

		res.status(200).json({
			message: "Habilidades listadas com sucesso.",
			abilities,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Erro ao listar habilidades.",
			error,
		});
	}
};
