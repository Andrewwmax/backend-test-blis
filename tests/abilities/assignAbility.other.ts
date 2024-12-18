import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { prismaMock } from "../../src/singleton";

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
		// Simula a verificação da habilidade no banco
		prismaMock.abilities.findUnique.mockResolvedValue({
			id: id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		// Simula a criação da associação
		prismaMock.usersAbilities.create.mockResolvedValue({
			id: id,
			user_id: id,
			ability_id: id,
			years_experience: 3,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app).post("/api/users/abilities").set("Authorization", `Bearer ${token}`).send({
			user_id: id,
			ability_id: id,
			years_experience: 3,
		});
		console.log(response.body);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("message", "Habilidade relacionada ao usuário com sucesso.");
		expect(response.body.userAbility).toHaveProperty("id", "uuid-user-ability-5678");
	});

	it("Deve retornar erro 400 se a habilidade não estiver ativa", async () => {
		// Simula habilidade inativa
		prismaMock.abilities.findUnique.mockResolvedValue({
			id: id,
			name: "React",
			active: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido

		const response = await request(app).post("/api/users/abilities").set("Authorization", `Bearer ${token}`).send({
			user_id: id,
			ability_id: id,
			years_experience: 3,
		});
		console.log(response.body);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Habilidade inativa ou não encontrada.");
	});

	it("Deve retornar erro 500 se ocorrer uma exceção", async () => {
		// Simula erro inesperado no Prisma
		prismaMock.abilities.findUnique.mockRejectedValue(new Error("Erro inesperado"));
		const token = process.env.TEST_TOKEN; // Simule ou obtenha um token JWT válido
		const response = await request(app).post("/api/users/abilities").set("Authorization", `Bearer ${token}`).send({
			user_id: id,
			ability_id: id,
			years_experience: 3,
		});
		console.log(response.body);

		expect(response.status).toBe(500);
		expect(response.body).toHaveProperty("message", "Erro ao relacionar habilidade.");
	});
});
