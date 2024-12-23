import { getWeatherByCoordinates } from "../../src/services/weather.service";

import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getWeatherByCoordinates", () => {
	const WEATHER_API_KEY = "mocked-api-key";
	const latitude = -23.5505;
	const longitude = -46.6333;

	beforeAll(() => {
		process.env.WEATHER_API_KEY = WEATHER_API_KEY; // Define a chave da API no ambiente
	});

	beforeEach(() => {
		jest.clearAllMocks(); // Limpa os mocks antes de cada teste
	});

	it("Deve retornar os dados climáticos corretamente", async () => {
		// Simula uma resposta bem-sucedida da API
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: {
				main: { temp: 25 }, // Temperatura simulada
				weather: [{ description: "ensolarado" }], // Condição climática simulada
			},
			statusText: "Ok",
		});

		const result = await getWeatherByCoordinates(latitude, longitude);

		// console.log("Resultado:", result); // Inspeciona o retorno

		expect(result).toEqual({
			temperature: "25°C",
			condition: "ensolarado",
			recommendation: "Use roupas de primavera!",
		});
	});

	it("Deve lançar erro se a chave da API não estiver configurada", async () => {
		delete process.env.WEATHER_API_KEY; // Remove a chave da API

		await expect(getWeatherByCoordinates(latitude, longitude)).rejects.toThrow(
			"A chave da API do OpenWeatherMap não está configurada."
		);

		process.env.WEATHER_API_KEY = WEATHER_API_KEY; // Restaura a chave da API
	});
	it("Deve lançar erro se os dados climáticos estiverem incompletos", async () => {
		// Simula uma resposta com dados incompletos
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: { main: null, weather: [] },
		});

		await expect(getWeatherByCoordinates(latitude, longitude)).rejects.toThrow(
			"Erro ao buscar informações do clima."
		);
	});

	it("Deve lançar erro se ocorrer uma falha de conexão", async () => {
		// Simula um erro de conexão
		mockedAxios.get.mockRejectedValue({
			isAxiosError: true,
			request: {},
			message: "Erro de conexão.",
		});

		await expect(getWeatherByCoordinates(latitude, longitude)).rejects.toThrow(
			"Erro ao buscar informações do clima."
		);
	});

	it("Deve lançar erro genérico para exceções não relacionadas ao Axios", async () => {
		// Simula um erro genérico
		mockedAxios.get.mockRejectedValue(new Error("Erro inesperado."));

		await expect(getWeatherByCoordinates(latitude, longitude)).rejects.toThrow(
			"Erro ao buscar informações do clima."
		);
	});
});
