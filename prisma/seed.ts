import { PrismaClient, UsersAbilities } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
	// Users
	const users = [
		{
			name: "André Couto",
			birthdate: new Date("1993-05-15"),
			email: "this.andreww@email.com",
			password: await hashPassword("711223c25398915b349807b419f171"),
		},
		{
			name: "Larissa Oliveira",
			birthdate: new Date("1986-11-20"),
			email: "larissa.oliveira@email.com",
			password: await hashPassword("fac010cb6cdcd452d1e46c95559ae0"),
		},
		{
			name: "João da Silva",
			birthdate: new Date("1990-05-15"),
			email: "joao.silva@email.com",
			password: await hashPassword("0420ee3dc22f19d248c43bf16b2b40"), //onetwothreefourfive@#
		},
		{
			name: "Maria Oliveira",
			birthdate: new Date("1985-12-20"),
			email: "maria.oliveira@email.com",
			password: await hashPassword("01fd78ec39172e18adb8f5961be8c8"), //onetwothreefour@#
		},
	];

	const abilities = [
		{ name: "Análise de Dados" },
		{ name: "Desenvolvimento Web" },
		{ name: "Desenvolvimento Mobile" },
		{ name: "Desenvolvimento de Redes" },
		{ name: "Desenvolvimento de Jogos" },
		{ name: "Desenvolvimento de Software" },
		{ name: "Desenvolvimento de Segurança" },
		{ name: "Desenvolvimento de Banco de Dados" },
		{ name: "Desenvolvimento de Interface de Usuário" },
		{ name: "Desenvolvimento de Inteligência Artificial" },
	];

	const usersIds = await prisma.users.findMany();
	const abilitiesIds = await prisma.abilities.findMany();

	const userAbilities: Pick<UsersAbilities, "ability_id" | "years_experience" | "user_id">[] = [
		{
			user_id: usersIds[0].id,
			ability_id: abilitiesIds[0].id,
			years_experience: 2,
		},
		{
			user_id: usersIds[1].id,
			ability_id: abilitiesIds[3].id,
			years_experience: 1,
		},
		{
			user_id: usersIds[2].id,
			ability_id: abilitiesIds[1].id,
			years_experience: 1,
		},
		{
			user_id: usersIds[3].id,
			ability_id: abilitiesIds[4].id,
			years_experience: 3,
		},
	];

	for (const user of users) {
		await prisma.users.create({ data: user });
	}

	for (const ability of abilities) {
		await prisma.abilities.create({ data: ability });
	}

	for (const userAbility of userAbilities) {
		await prisma.usersAbilities.create({ data: userAbility });
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
