import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { prismaMock } from "../../src/singleton";
import { createAbilityService } from "../../src/services/abilities.service";

describe("POST /abilities", () => {
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

	it("Deve criar uma nova habilidade com sucesso", async () => {
		// Simula a resposta do Prisma
		prismaMock.abilities.create.mockResolvedValue({
			id: id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ name: "React" });

		// console.log(response.body);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("message", "Habilidade criada com sucesso.");
		expect(response.body.ability).toHaveProperty("name", "React");
	});

	it("Deve retornar erro 400 se o nome da habilidade não for fornecido", async () => {
		const response = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({}); // Sem o nome

		// console.log(response.body);
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Erro de validação"); // Mensagem de erro mais específica
		expect(response.body).toHaveProperty("details", ['"name" is required']); // Mensagem de erro mais específica
	});

	it("Deve retornar 401 se o token não for fornecido", async () => {
		const response = await request(app).post("/api/abilities").send({ name: "React" }); // Sem token

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message", "Token não fornecido.");
	});

	it("Deve retornar 401 se o token for invalido", async () => {
		const response = await request(app).post("/api/abilities").set("Authorization", `Bearer tokenInvalido`); // Token invalido

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message", "Token inválido.");
	});

	it("Deve retornar erro 400 se o nome da habilidade não for enviado", async () => {
		const response = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Erro de validação");
	});

	// it("Deve retornar erro 500 se ocorrer uma exceção", async () => {
	// 	// Simula um erro inesperado no Prisma
	// 	prismaMock.abilities.create.mockRejectedValue(new Error("Erro inesperado"));

	// 	const response = await request(app)
	// 		.post("/api/abilities")
	// 		.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
	// 		.send({ name: "React" });

	// 	expect(response.status).toBe(500);
	// 	expect(response.body).toHaveProperty("message", "Erro ao criar habilidade.");
	// });
});
