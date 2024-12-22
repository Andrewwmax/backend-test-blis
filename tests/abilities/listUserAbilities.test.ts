import request from "supertest";
import app from "../../src/app";
import { listUserAbilities } from "../../src/controllers/abilities.controller";

describe("listUserAbilities", () => {
	it("deve listar habilidades do usuário com sucesso", async () => {
		const user_id = "123e4567-e89b-12d3-a456-426655440000";
		const page = 1;
		const limit = 10;

		const response = await request(app)
			.get("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ user_id, page, limit });

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("Habilidades do usuário listadas com sucesso.");
		expect(response.body.abilities).toBeInstanceOf(Array);
	});

	it("deve lidar com erro ao listar habilidades do usuário", async () => {
		const user_id = "invalid-user-id";
		const page = 1;
		const limit = 10;

		const response = await request(app)
			.get("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ user_id, page, limit });
		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Erro de validação");
		expect(response.body.details).toBeInstanceOf(Object);
	});

	it("deve retornar erro quando o user_id estiver faltando", async () => {
		const page = 1;
		const limit = 10;

		const response = await request(app)
			.get("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ page, limit });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Erro de validação");
		expect(response.body.details).toBeInstanceOf(Object);
	});

	it("deve retornar erro quando a página ou limite forem inválidos", async () => {
		const user_id = "123e4567-e89b-12d3-a456-426655440000";
		const page = "invalid-page";
		const limit = "invalid-limit";

		const response = await request(app)
			.get("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.query({ user_id, page, limit });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Erro de validação");
		expect(response.body.details).toBeInstanceOf(Object);
	});
});
