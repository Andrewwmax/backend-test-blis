import { Prisma, PrismaClient } from "@prisma/client";
import { Ability } from "../interfaces/ability";
import { UserAbility } from "../interfaces/userAbility";
import { User } from "../interfaces/user";

const prisma = new PrismaClient();

/** Cria uma nova habilidade.
 *
 * @param {string} name - Nome da habilidade
 *
 * @returns {Promise<Ability>} - Habilidade criada
 */
export const createAbilityService = async (name: string): Promise<Ability> => {
	return prisma.abilities.create({
		data: { name },
	});
};

/** Atualiza o status ativo de uma habilidade.
 *
 * @param {string} id - ID da habilidade a ser atualizada
 * @param {boolean} active - Novo status ativo da habilidade
 * @returns {Promise<Ability>} - A promessa que resolve o objeto de habilidade atualizado
 */
export const updateAbilityStatusService = async (id: string, active: boolean): Promise<Ability> => {
	return prisma.abilities.update({
		where: { id },
		data: { active },
	});
};

/** Associa uma habilidade a um usuário, se a habilidade estiver ativa.
 *
 * @param {string} user_id - ID do usuário ao qual a habilidade será associada
 * @param {string} ability_id - ID da habilidade a ser associada
 * @param {number} years_experience - Anos de experiência do usuário com a habilidade
 *
 * @returns {Promise<UserAbility>} - A promessa que resolve o objeto de associação de habilidade do usuário criado
 * @throws {Error} - Lança erro se a habilidade não for encontrada ou estiver inativa
 */
export const assignAbilityToUserService = async (
	user_id: string,
	ability_id: string,
	years_experience: number
): Promise<UserAbility> => {
	// Verifica se a habilidade está ativa
	const ability = await prisma.abilities.findUnique({
		where: { id: ability_id },
	});

	if (!ability || !ability.active) {
		throw new Error("Habilidade inativa ou não encontrada.");
	}

	// Relaciona a habilidade ao usuário
	return prisma.usersAbilities.create({
		data: {
			user_id,
			ability_id,
			years_experience,
		},
	});
};

/** Deleta as habilidades de um usuário.
 *
 * @param {string[]} ids - Array de ids das habilidades a serem deletadas
 *
 * @returns {Promise<Prisma.BatchPayload>} - A promessa que resolve o objeto de retorno do prisma
 * @throws {Error} - Caso existam ids que nao existem
 */
export const deleteUserAbilitiesService = async (ids: string[]): Promise<Prisma.BatchPayload> => {
	// Verifica se os ids existem
	const existingIds: Pick<UserAbility, "id">[] = await prisma.usersAbilities.findMany({
		where: { id: { in: ids } },
		select: { id: true },
	});
	// Verifica os ids que não existem
	const nonExistingIds = ids.filter((id) => !existingIds.some((existingId) => existingId.id === id));

	// Caso existam ids que não existem, lanca um erro
	if (nonExistingIds.length > 0) {
		throw new Error(`Os seguintes ids não existem: ${nonExistingIds.join(", ")}.`);
	}

	// Deleta os ids existentes
	return prisma.usersAbilities.deleteMany({
		where: { id: { in: ids } },
	});
};

/** Lista as habilidades de um usuário.
 *
 * @param {string} user_id - ID do usuário
 * @param {number} page - Número da página
 * @param {number} limit - Limite de habilidades
 *
 * @arguments {number} skip - salto de páginas
 *
 * @returns {Promise<UserAbility[]>}
 */
export const listUserAbilitiesService = async (
	user_id: string,
	page: number,
	limit: number
): Promise<UserAbility[]> => {
	// Calcula o salto de páginas
	const skip = (page - 1) * limit;

	// Busca as habilidades do usuário com base nos parâmetros
	return prisma.usersAbilities.findMany({
		where: { user_id },
		// Inclui as informações da habilidade e do usuário
		include: {
			Ability: true,
			User: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		// Aplica o salto de páginas e o limite
		skip,
		take: limit,
		// Ordena as habilidades por data de criação em ordem decrescente
		orderBy: { created_at: "desc" },
	});
};
