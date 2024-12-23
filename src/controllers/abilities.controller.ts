import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
	createAbilityService,
	updateAbilityStatusService,
	deleteUserAbilitiesService,
	listUserAbilitiesService,
	assignAbilityToUserService,
} from "../services/abilities.service";
import {
	AssignAbilityResponse,
	CreateAbilityResponse,
	DeleteAbilityResponse,
	deleteUserAbilitiesResponse,
	ListAbilitiesResponse,
	ListUserAbilityResponse,
	UpdateAbilityResponse,
} from "../interfaces/ability";
import { ErrorResponse } from "../interfaces/error";

const prisma = new PrismaClient();

/** Cria uma nova habilidade.
 *
 * @param {Request} req - Requisição
 * @param {Response} res - Resposta
 *
 * @arguments {string} name - Nome da habilidade
 *
 * @returns {Promise<void>}
 */
export const createAbility = async (req: Request, res: Response<CreateAbilityResponse | ErrorResponse>) => {
	const { name } = req.body;

	try {
		const ability = await createAbilityService(name);

		res.status(201).json({
			message: "Habilidade criada com sucesso.",
			ability,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Erro ao criar habilidade.", error });
	}
};

/** Atualiza o status de uma habilidade.
 *
 * @param {Request} req - Requisição contendo o ID e status ativo da habilidade
 * @param {Response} res - Resposta com a mensagem de sucesso ou erro
 *
 * @arguments {string} id - ID da habilidade
 * @arguments {boolean} active - Status ativo da habilidade
 *
 * @returns {Promise<void>}
 */
export const updateAbility = async (req: Request, res: Response<UpdateAbilityResponse | ErrorResponse>) => {
	const { id, active } = req.body; // Extrai o ID e o status ativo do corpo da requisição

	try {
		// Chama o serviço para atualizar o status da habilidade
		const ability = await updateAbilityStatusService(id, active);

		// Se a atualização for bem-sucedida, retorna uma resposta de sucesso
		res.status(200).json({
			message: "Habilidade atualizada com sucesso.",
			ability,
		});
	} catch (error) {
		// Em caso de erro, captura e retorna uma resposta de erro
		res.status(400).json({
			message: "Erro ao atualizar habilidade.",
			error,
		});
	}
};

/** Relaciona uma habilidade a um usuário.
 *
 * @param {Request} req - Requisição contendo o ID do usuário, ID da habilidade e anos de experiência
 * @param {Response} res - Resposta com a mensagem de sucesso ou erro
 *
 * @arguments {string} user_id - ID do usuário
 * @arguments {string} ability_id - ID da habilidade
 * @arguments {number} years_experience - anos de experiência
 *
 * @returns {Promise<void>}
 */
export const assignAbility = async (
	req: Request,
	res: Response<AssignAbilityResponse | ErrorResponse>
): Promise<void> => {
	// Extrai os dados do corpo da requisição
	const { user_id, ability_id, years_experience } = req.body;

	try {
		// Chama o serviço para relacionar a habilidade ao usuário
		await assignAbilityToUserService(user_id, ability_id, years_experience);

		// Busca a habilidade relacionada ao usuário
		const userAbility = await prisma.usersAbilities.findFirst({
			where: { user_id, ability_id },
		});

		// Se a relacionação for bem-sucedida, retorna uma resposta de sucesso
		res.status(201).json({
			message: "Habilidade relacionada ao usuário com sucesso.",
			userAbility,
		});
	} catch (error: any) {
		// Em caso de erro, captura e retorna uma resposta de erro
		res.status(400).json({
			message: "Erro ao remover habilidades.",
			error: error.message,
		});
	}
};

/** Remove uma habilidade relacionada a um usuário.
 * @param {Request} req - Requisição contendo o array de IDs das habilidades a serem removidas
 * @param {Response} res - Resposta com a mensagem de sucesso ou erro
 *
 * @arguments {string[]} ids - Array de IDs das habilidades a serem removidas
 * Exemplo de requisição:
 * {
 *  "ids": ["1", "2", "3"]
 * }
 *
 * @throws {Error} - Caso haja um erro ao deletar as habilidades
 */
export const deleteAbilities = async (req: Request, res: Response<DeleteAbilityResponse | ErrorResponse>) => {
	const { ids } = req.body;

	try {
		// Chama o serviço para deletar as habilidades
		const abilities: deleteUserAbilitiesResponse = await deleteUserAbilitiesService(ids);

		// Se a remoção for bem-sucedida, retorna uma resposta de sucesso
		res.status(200).json({ message: "Habilidade(s) removida(s) com sucesso.", abilities });
	} catch (error: any) {
		// Em caso de erro, captura e retorna uma resposta de erro
		res.status(400).json({ message: "Erro ao remover habilidades.", error: error.message });
	}
};

/** Lista todas as habilidades de um usuário.
 *
 * @param {Request} req - Requisição contendo o ID do usuário, página e limite de habilidades
 * @param {Response} res - Resposta com a lista de habilidades e mensagem de sucesso ou erro
 *
 * @arguments {string} user_id - ID do usuário
 * @arguments {number} page - número da página
 * @arguments {number} limit - limite de habilidades
 *
 * @returns {Promise<void>}
 */
export const listUserAbilities = async (req: Request, res: Response<ListUserAbilityResponse | ErrorResponse>) => {
	const { user_id, page = 1, limit = 10 } = req.query;

	try {
		// Chama o serviço para listar as habilidades do usuário
		const abilities = await listUserAbilitiesService(String(user_id), Number(page), Number(limit));

		// Se a lista for bem-sucedida, retorna uma resposta de sucesso
		res.status(200).json({
			message: "Habilidades do usuário listadas com sucesso.",
			abilities,
		});
	} catch (error) {
		// Em caso de erro, captura e retorna uma resposta de erro
		console.error(error);
		res.status(500).json({
			message: "Erro ao listar habilidades do usuário.",
			error,
		});
	}
};

/** Lista todas as habilidades disponíveis.
 *
 * @param {Request} req - Requisição contendo a página e limite de habilidades
 * @param {Response} res - Resposta com a lista de habilidades e mensagem de sucesso ou erro
 *
 * @arguments {number} page - número da página
 * @arguments {number} limit - limite de habilidades
 *
 * @returns {Promise<void>}
 */
export const listAbilities = async (req: Request, res: Response<ListAbilitiesResponse | ErrorResponse>) => {
	// Extrai a página e o limite dos parâmetros de consulta, com valores padrão de 1 e 10
	const { page = 1, limit = 10 } = req.query;

	try {
		// Chama o serviço para listar todas as habilidades
		const abilities = await listUserAbilitiesService("all", Number(page), Number(limit));

		// Se a lista for bem-sucedida, retorna uma resposta de sucesso
		res.status(200).json({
			message: "Habilidades listadas com sucesso.",
			abilities,
		});
	} catch (error) {
		// Em caso de erro, captura e retorna uma resposta de erro
		console.error(error);
		res.status(500).json({
			message: "Erro ao listar habilidades.",
			error,
		});
	}
};
