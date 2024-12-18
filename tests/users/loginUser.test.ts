import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { hashPassword } from "../../src/utils/hash";

import { prismaMock } from "../../src/singleton";

describe("POST /users/login", () => {
	const id = uuidv4();

	it("Deve realizar login com sucesso e retornar um token", async () => {
		// Simula o hash de uma senha armazenada no banco
		const hashedPassword = await hashPassword("senhaSegura123");

		// Simula a resposta do Prisma para encontrar o usuário pelo email
		prismaMock.users.findUnique.mockResolvedValue({
			id: id,
			name: "Maria Silva",
			email: "maria@email.com",
			birthdate: new Date("1995-01-01"),
			password: hashedPassword,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app).post("/api/users/login").send({
			email: "maria@email.com",
			password: "senhaSegura123",
		});
		// console.log(response.body);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.message).toBe("Login realizado com sucesso.");
	});

	it("Deve retornar erro 404 se o email não for encontrado", async () => {
		// Simula um usuário inexistente
		prismaMock.users.findUnique.mockResolvedValue(null);

		const response = await request(app).post("/api/users/login").send({
			email: "naoexiste@email.com",
			password: "senhaIncorreta",
		});

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Usuário não encontrado.");
	});

	it("Deve retornar erro 401 se a senha estiver incorreta", async () => {
		// Simula o hash de uma senha armazenada no banco
		const hashedPassword = await hashPassword("senhaCorreta");

		// Simula a resposta do Prisma para encontrar o usuário pelo email
		prismaMock.users.findUnique.mockResolvedValue({
			id: "uuid-1234",
			name: "Maria Silva",
			email: "maria@email.com",
			birthdate: new Date("1995-01-01"),
			password: hashedPassword,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app).post("/api/users/login").send({
			email: "maria@email.com",
			password: "senhaErrada",
		});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("message", "Senha incorreta.");
	});

	it("Deve retornar erro 500 se ocorrer uma exceção", async () => {
		// Simula um erro inesperado no Prisma
		prismaMock.users.findUnique.mockRejectedValue(new Error("Erro inesperado"));

		const response = await request(app).post("/api/users/login").send({
			email: "teste@test.com",
			password: "senhaSegura123",
		});
		// console.log(response.body);

		expect(response.status).toBe(500);
		expect(response.body).toHaveProperty("message", "Erro ao realizar login.");
	});
});
