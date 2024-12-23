import axios, { AxiosError, AxiosResponse } from "axios";
import { OpenWeatherMapResponse, WeatherData } from "../interfaces/weather";

export const getWeatherByCoordinates = async (latitude: number, longitude: number): Promise<WeatherData> => {
	const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
	if (!WEATHER_API_KEY) {
		throw new Error("A chave da API do OpenWeatherMap não está configurada.");
	}

	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=pt`;

	try {
		const response: AxiosResponse<OpenWeatherMapResponse> = await axios.get(url);
		// Verifica se a resposta foi bem-sucedida (status 2xx)
		if (response.status < 200 || response.status >= 300) {
			throw new Error(
				`Erro na requisição da API: Status ${response.status} - ${
					response.data.message || "Sem mensagem específica."
				}`
			);
		}

		const { main, weather } = response.data;

		if (!main || !weather || weather.length === 0) {
			throw new Error("Dados de clima inválidos recebidos da API."); // Lançar erro se os dados estiverem faltando
		}

		const temperature = main.temp;
		const condition = weather[0].description;

		const recommendation = getRecommendation(temperature);

		return {
			temperature: `${temperature}°C`,
			condition,
			recommendation,
		};
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<OpenWeatherMapResponse>;

			if (axiosError.response) {
				// Erro de resposta da API (ex: 404, 500)
				// console.error(
				// `Erro na API do OpenWeatherMap: Status ${axiosError.response.status}, Dados:`,
				// axiosError.response.data
				// );
				throw new Error(
					`Erro na API do OpenWeatherMap: ${axiosError.response.data.message || "Erro desconhecido"}`
				);
			} else if (axiosError.request) {
				// Erro na requisição (ex: sem conexão)
				// console.error("Erro na requisição para a API do OpenWeatherMap:", axiosError.message);
				throw new Error("Erro ao conectar com a API do OpenWeatherMap.");
			} else {
				// Outro erro do Axios
				// console.error("Erro no Axios:", axiosError.message);
				throw new Error("Erro na requisição da API de clima.");
			}
		} else {
			// Erro genérico
			// console.error("Erro ao buscar informações do clima:", error);
			throw new Error("Erro ao buscar informações do clima.");
		}
	}
};

const getRecommendation = (temperature: number): string => {
	if (temperature < 16) {
		return "Frio! Leve um casaco grosso!";
	} else if (temperature < 20) {
		return "Leve um casaco!";
	} else if (temperature < 23) {
		return "Use roupas de inverno!";
	} else if (temperature < 26) {
		return "Use roupas de primavera!";
	} else {
		return "Use roupas leves!";
	}
};
