import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import app from "../../src/app";

import { hashPassword } from "../../src/utils/hash";

import { prismaMock } from "../../src/singleton";
import { generateRandomString } from "../../src/utils/randomStrings";

describe("DELETE /abilities", () => {
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

	it("Deve deletar uma habilidade com sucesso", async () => {
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
				email: `${generateRandomString()}@email.com`,
				password: "hashed_password",
			});

		const response_login_user = await request(app).post("/api/users/login").send({
			email: response_create_user.body.user.email,
			password: "hashed_password",
		});

		const token = response_login_user.body.token;

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

		const response_create_userAbility = await request(app)
			.post("/api/users/abilities")
			.set("Authorization", `Bearer ${token}`)
			.send({
				user_id: response_create_user.body.user.id,
				ability_id: response_create_ability.body.ability.id,
				years_experience: 3,
			});

		prismaMock.usersAbilities.delete.mockResolvedValue({
			id: id,
			ability_id: response_create_ability.body.ability.id,
			user_id: response_create_user.body.user.id,
			years_experience: 3,
			updated_at: new Date(),
			created_at: new Date(),
		});

		const response = await request(app)
			.delete(`/api/users/abilities`)
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({
				ids: [response_create_userAbility.body.userAbility.id],
			});
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("message", "Habilidade(s) removida(s) com sucesso.");
	});

	it("Deve retornar erro 404 se a(s) habilidade(s) nao existir(em)", async () => {
		const response = await request(app)
			.delete(`/api/users/abilities`)
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({
				ids: [uuidv4(), uuidv4()],
			});
		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("error", expect.stringMatching(/^Os seguintes ids não existem: .+/));
	});

	it("Deve retornar erro 400 se as habilidades forem vazias", async () => {
		const response = await request(app)
			.delete("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("error", "Cannot read properties of undefined (reading 'filter')");
	});
});
