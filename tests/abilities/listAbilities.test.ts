import request from "supertest";
import app from "../../src/app";
import { listUserAbilities } from "../../src/controllers/abilities.controller";

describe("listUserAbilities", () => {
	it("deve listar todas as habilidades com sucesso", async () => {
		const page = 1;
		const limit = 10;

		const response = await request(app)
			.get("/api/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.send({ page, limit });

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("Habilidades listadas com sucesso.");
		expect(response.body.abilities).toBeInstanceOf(Array);
	});

	it("deve retornar erro quando a página ou limite forem inválidos", async () => {
		const page = "invalid-page";
		const limit = "invalid-limit";

		const response = await request(app)
			.get("/api/users/abilities")
			.set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
			.query({ page, limit });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Erro de validação");
		expect(response.body.details).toBeInstanceOf(Object);
	});
});
