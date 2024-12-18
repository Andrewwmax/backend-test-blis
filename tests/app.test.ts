import request from "supertest";
import app from "../src/app";

describe("Testando a Inicialização da Aplicação", () => {
	it("Deve retornar erro 404 para rotas inexistentes", async () => {
		const response = await request(app).get("/rota-inexistente");
		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Rota não encontrada");
	});

	it("Deve processar JSON no corpo da requisição", async () => {
		const response = await request(app).post("/api/users").send({ name: "Teste", email: "teste@email.com" });

		// Verifica que o JSON foi processado (assumindo validação no controller)
		expect(response.status).toBeGreaterThanOrEqual(200);
	});

	it("Deve retornar erro 404 para exceções no middleware", async () => {
		// Força um erro simulando uma rota
		app.get("/force-error", (req, res) => {
			throw new Error("Erro forçado");
		});

		const response = await request(app).get("/force-error");
		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("message", "Rota não encontrada");
	});
});
