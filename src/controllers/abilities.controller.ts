import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Cria uma nova habilidade
 */
export const createAbility = async (req: Request, res: Response) => {
	const { name } = req.body;

	try {
		const ability = await prisma.abilities.create({
			data: { name },
		});

		res.status(201).json({
			message: "Habilidade criada com sucesso.",
			ability,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erro ao criar habilidade.", error });
	}
};

/**
 * Edita uma habilidade (ativa ou desativa)
 */
export const editAbility = async (req: Request, res: Response) => {
	const { id, active } = req.body;

	try {
		const ability = await prisma.abilities.update({
			where: { id },
			data: { active },
		});

		res.status(200).json({
			message: "Habilidade atualizada com sucesso.",
			ability,
		});
	} catch (error) {
		console.error(error);
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
		const ability = await prisma.abilities.findUnique({
			where: { id: ability_id },
		});

		if (!ability || !ability.active) {
			return res.status(400).json({ message: "Habilidade inativa ou não encontrada." });
		}

		const userAbility = await prisma.usersAbilities.create({
			data: {
				user_id,
				ability_id,
				years_experience,
			},
		});

		res.status(201).json({
			message: "Habilidade relacionada ao usuário com sucesso.",
			userAbility,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Erro ao relacionar habilidade.",
			error,
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
		await prisma.usersAbilities.deleteMany({
			where: { id: { in: ids } },
		});

		res.status(200).json({ message: "Habilidades removidas com sucesso." });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Erro ao remover habilidades.", error });
	}
};

/**
 * Lista habilidades de um usuário com paginação
 */
export const listUserAbilities = async (req: Request, res: Response) => {
	const { user_id, page = 1, limit = 10 } = req.query;

	try {
		const abilities = await prisma.usersAbilities.findMany({
			where: { user_id: String(user_id) },
			include: {
				Ability: true,
				User: {
					select: { id: true, name: true, email: true }, // Exclui senha
				},
			},
			skip: (Number(page) - 1) * Number(limit),
			take: Number(limit),
			orderBy: { created_at: "desc" },
		});

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
		const abilities = await prisma.abilities.findMany({
			where: { active: true },
			skip: (Number(page) - 1) * Number(limit),
			take: Number(limit),
			orderBy: { created_at: "desc" },
		});

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
