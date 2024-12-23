import request from "supertest";
import app from "../../src/app"; // Sua instância do Express
import { getWeatherByCoordinates } from "../../src/services/weather.service";

import axios, { AxiosError } from "axios";

jest.mock("../../src/services/weather.service");
describe("GET /api/weather", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Limpa os mocks antes de cada teste
	});

	it("Deve retornar erro 400 se latitude ou longitude não forem fornecidas", async () => {
		const response = await request(app).post("/api/weather").send({});

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty("details", ['"latitude" is required', '"longitude" is required']);
		expect(response.body).toHaveProperty("message", "Erro de validação");
	});

	it("Deve retornar as informações climáticas corretamente", async () => {
		// Simula o retorno da função getWeatherByCoordinates
		(getWeatherByCoordinates as jest.Mock).mockResolvedValue({
			temperature: "28°C",
			condition: "Ensolarado",
			recommendation: "Use roupas leves!",
		});

		const response = await request(app).post("/api/weather").send({ latitude: -23.5505, longitude: -46.6333 });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("temperature", "28°C");
		expect(response.body).toHaveProperty("condition", "Ensolarado");
		expect(response.body).toHaveProperty("recommendation", "Use roupas leves!");
	});

	it("Deve retornar erro 500 se ocorrer uma exceção", async () => {
		// Simula um erro na função getWeatherByCoordinates
		(getWeatherByCoordinates as jest.Mock).mockRejectedValue(new Error("Erro ao buscar dados climáticos"));

		const response = await request(app).post("/api/weather").send({ latitude: -23.5505, longitude: -46.6333 });

		expect(response.status).toBe(500);
		expect(response.body).toHaveProperty("message", "Erro ao buscar dados climáticos");
	});
});
