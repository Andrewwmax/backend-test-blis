import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { hashPassword } from "../../src/utils/hash";

import { prismaMock } from "../../src/singleton";

describe("PUT /abilities", () => {
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

	it("Deve ativar/desativar uma habilidade com sucesso", async () => {
		prismaMock.abilities.create.mockResolvedValue({
			id: id,
			name: "React",
			active: true,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response_create = await request(app)
			.post("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ name: "React" });

		prismaMock.abilities.update.mockResolvedValue({
			id: response_create.body.ability.id,
			name: "React",
			active: false,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app)
			.put("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({
				id: response_create.body.ability.id,
				active: false,
			});
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("message", "Habilidade atualizada com sucesso.");
		expect(response.body.ability).toHaveProperty("active", false);
	});

	it("Deve retornar erro 400 se o ID da habilidade não for enviado", async () => {
		const response = await request(app)
			.put("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({
				active: true,
			});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Erro de validação");
	});

	it("Deve retornar erro 400 se ocorrer uma exceção", async () => {
		// Simula um erro inesperado no Prisma
		prismaMock.abilities.update.mockResolvedValue({
			id: uuidv4(),
			name: "React",
			active: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const token = process.env.TEST_TOKEN;
		const response = await request(app).put("/api/abilities").set("Authorization", `Bearer ${token}`).send({
			id: id,
			active: true,
		});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Erro ao atualizar habilidade.");
		expect(response.body).toHaveProperty(
			"error",
			expect.objectContaining({
				meta: expect.objectContaining({
					cause: "Record to update not found.",
				}),
			})
		);
	});
});
