import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { resetMocks, mockPrisma } from "../../mocks/setupMocks";
import { hashPassword } from "../../src/utils/hash";

describe("PUT /abilities", () => {
	beforeEach(() => {
		resetMocks(); // Reseta os mocks antes de cada teste
	});

	it("Deve ativar/desativar uma habilidade com sucesso", async () => {
		// Simula a resposta do Prisma
		const id = uuidv4();

		const hashedPassword = await hashPassword("senhaSegura123");

		mockPrisma.users.findUnique.mockResolvedValue({
			id: id,
			name: "Maria Silva",
			email: "maria@email.com",
			birthdate: new Date("1995-01-01"),
			password: hashedPassword,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response_login = await request(app).post("/api/users/login").send({
			email: "maria@email.com",
			password: "senhaSegura123",
		});

		console.log(response_login.body.token);

		mockPrisma.abilities.update.mockResolvedValue({
			id: id,
			name: "React",
			active: false,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app)
			.put("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({
				id: id,
				active: false,
			});
		console.log(response.body);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("message", "Habilidade atualizada com sucesso.");
		expect(response.body.ability).toHaveProperty("active", false);
	});

	it("Deve retornar erro 400 se o ID da habilidade não for enviado", async () => {
		const response = await request(app).put("/api/abilities").send({
			active: true,
		});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Erro de validação");
	});

	it("Deve retornar erro 500 se ocorrer uma exceção", async () => {
		// Simula um erro inesperado no Prisma
		mockPrisma.abilities.update.mockRejectedValue(new Error("Erro inesperado"));
		const token = process.env.TEST_TOKEN;
		const response = await request(app).put("/api/abilities").set("Authorization", `Bearer ${token}`).send({
			id: "uuid-ability-1234",
			active: true,
		});

		expect(response.status).toBe(500);
		expect(response.body).toHaveProperty("message", "Erro ao atualizar habilidade.");
	});
});
