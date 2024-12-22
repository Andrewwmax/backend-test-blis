import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { prismaMock } from "../../src/singleton";
import { hashPassword } from "../../src/utils/hash";
import { generateRandomString } from "../../src/utils/randomStrings";

describe("POST /users/abilities", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	beforeAll(() => {
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});
	const id = uuidv4();

	it("Deve associar uma habilidade a um usuário com sucesso", async () => {
		prismaMock.abilities.create.mockResolvedValue({
			id: id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response_create_ability = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ name: "React" });

		prismaMock.users.create.mockResolvedValue({
			id: id,
			name: "João Silva",
			birthdate: new Date("1990-01-01"),
			email: "teste@email.com",
			password: await hashPassword("hashed_password"),
			created_at: new Date(),
			updated_at: new Date(),
		});
		const response_create_user = await request(app)
			.post("/api/users")
			.send({
				name: "João Silva",
				birthdate: "1990-01-01",
				// email: `teste@email.com`,
				email: `${generateRandomString()}@email.com`,
				password: "hashed_password",
			});

		prismaMock.abilities.findUnique.mockResolvedValue({
			id: response_create_ability.body.ability.id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		// Simula a criação da associação
		prismaMock.usersAbilities.create.mockResolvedValue({
			id: id,
			user_id: response_create_user.body.user.id,
			ability_id: response_create_ability.body.ability.id,
			years_experience: 3,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app).post("/api/users/abilities").set("Authorization", `Bearer ${token}`).send({
			user_id: response_create_user.body.user.id,
			ability_id: response_create_ability.body.ability.id,
			years_experience: 3,
		});

		expect(response.status).toBe(201);
		expect(response.body.userAbility).toHaveProperty("years_experience", 3);
		expect(response.body).toHaveProperty("message", "Habilidade relacionada ao usuário com sucesso.");
	});

	it("Deve retornar erro 400 se a habilidade não estiver ativa", async () => {
		// Simula habilidade inativa
		prismaMock.abilities.create.mockResolvedValue({
			id: id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response_create_ability = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ name: "React" });

		prismaMock.users.create.mockResolvedValue({
			id: id,
			name: "João Silva",
			birthdate: new Date("1990-01-01"),
			email: "teste@email.com",
			password: await hashPassword("hashed_password"),
			created_at: new Date(),
			updated_at: new Date(),
		});
		const response_create_user = await request(app)
			.post("/api/users")
			.send({
				name: "João Silva",
				birthdate: "1990-01-01",
				// email: `teste@email.com`,
				email: `${generateRandomString()}@email.com`,
				password: "hashed_password",
			});

		prismaMock.abilities.findUnique.mockResolvedValue({
			id: response_create_ability.body.ability.id,
			name: "React",
			active: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app).post("/api/users/abilities").set("Authorization", `Bearer ${token}`).send({
			user_id: response_create_ability.body.ability.id,
			ability_id: response_create_user.body.user.id,
			years_experience: 3,
		});

		expect(response.status).toBe(400);
		// expect(response.body).toHaveProperty("message", "Erro ao relacionar habilidade.");
		expect(response.body).toHaveProperty("error", "Habilidade inativa ou não encontrada.");
	});
});
