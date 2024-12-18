import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { hashPassword } from "../../src/utils/hash";
import { generateRandomString } from "../../src/utils/randomStrings";

import { prismaMock } from "../../src/singleton";

describe("POST /users", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	beforeAll(() => {
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});
	// const id = uuidv4();

	it("Deve criar um usuário com sucesso", async () => {
		// Simula a resposta do Prisma
		const id = uuidv4();

		prismaMock.users.findUnique.mockResolvedValue({
			id: "uuid-1234",
			name: "João Silva",
			birthdate: new Date("1990-01-01"),
			email: "teste@email.com",
			password: "hashed_password",
			created_at: new Date(),
			updated_at: new Date(),
		});
		prismaMock.users.create.mockResolvedValue({
			id: id,
			name: "João Silva",
			birthdate: new Date("1990-01-01"),
			email: "teste@email.com",
			password: await hashPassword("hashed_password"),
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app)
			.post("/api/users")
			.send({
				name: "João Silva",
				birthdate: "1990-01-01",
				email: `${generateRandomString()}@email.com`,
				password: "hashed_password",
			});
		// console.log(response.body);
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("user");
		expect(response.body.user).toHaveProperty("name", "João Silva");
	});

	it("Deve retornar erro ao criar usuário com email duplicado", async () => {
		// Simula o comportamento do Prisma ao encontrar email duplicado
		prismaMock.users.findUnique.mockResolvedValue({
			id: "uuid-1234",
			name: "João Silva",
			birthdate: new Date("1990-01-01"),
			email: "joao@email.com",
			password: "hashed_password",
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response = await request(app).post("/api/users").send({
			name: "João Silva",
			birthdate: "1990-01-01",
			email: "joao@email.com",
			password: "senha123456",
		});

		// console.log(response.body);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("message", "Email já está em uso.");
	});
});

describe("Logout User", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	beforeAll(() => {
		jest.resetAllMocks();
	});
	afterAll(() => {
		jest.resetAllMocks();
	});
	it("should return 400 if token is not provided", async () => {
		const response = await request(app).post("/api/users/logout");

		// console.log(response.body);
		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Token não fornecido.");
	});

	it("deve retornar 200 se o token for válido e o logout for bem sucedido", async () => {
		// Simule um token válido
		const id = uuidv4();
		const hashedPassword = await hashPassword("senhaSegura123");

		prismaMock.users.findUnique.mockResolvedValue({
			id: id,
			name: "Maria Silva",
			email: "maria@email.com",
			birthdate: new Date("1995-01-01"),
			password: hashedPassword,
			created_at: new Date(),
			updated_at: new Date(),
		});

		const response_token = await request(app).post("/api/users/login").send({
			email: "maria@email.com",
			password: "senhaSegura123",
		});
		// console.log(response_token.body.token);
		const token = response_token.body.token;
		const response = await request(app).post("/api/users/logout").set("Authorization", `Bearer ${token}`);
		// console.log(response.body);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("Logout realizado com sucesso.");
	});

	it("deve retornar 401 se o token for inválido durante o logout", async () => {
		// Simule um token inválido
		const token = "test_token";
		const response = await request(app).post("/api/users/logout").set("Authorization", `Bearer ${token}`);
		// console.log(response.body);

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Token inválido.");
	});

	it("deve retornar 500 se ocorrer um erro durante o logout", async () => {
		// Simule um token inválido
		const token = process.env.TEST_TOKEN as string;
		const response_used_token = await request(app)
			.post("/api/users/logout")
			.set("Authorization", `Bearer ${token}`);
		const response = await request(app).post("/api/users/logout").set("Authorization", `Bearer ${token}`);
		// console.log(response_used_token.body);
		// console.log(response.body);

		expect(response_used_token.status).toBe(200);
		expect(response_used_token.body.message).toBe("Logout realizado com sucesso.");
		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Token inválido ou expirado.");
	});
});
