import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAbilityService = async (name: string) => {
	return prisma.abilities.create({
		data: { name },
	});
};

export const updateAbilityStatusService = async (
	id: string,
	active: boolean
) => {
	return prisma.abilities.update({
		where: { id },
		data: { active },
	});
};

export const assignAbilityToUserService = async (
	user_id: string,
	ability_id: string,
	years_experience: number
) => {
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

export const deleteUserAbilityService = async (id: string) => {
	return prisma.usersAbilities.delete({
		where: { id },
	});
};

export const listUserAbilitiesService = async (
	user_id: string,
	page: number,
	limit: number
) => {
	const skip = (page - 1) * limit;

	return prisma.usersAbilities.findMany({
		where: { user_id },
		include: {
			Ability: true,
			User: {
				select: { id: true, name: true, email: true },
			},
		},
		skip,
		take: limit,
		orderBy: { created_at: "desc" },
	});
};
