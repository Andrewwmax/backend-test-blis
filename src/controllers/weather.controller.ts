import { Request, Response } from "express";
import { getWeatherByCoordinates } from "../services/weather.service";

/**
 * Retorna as informações climáticas para as coordenadas recebidas no corpo da requisição.
 * @param req Requisição HTTP, contendo as coordenadas no corpo.
 * @param res Resposta HTTP, contendo o status e o corpo da resposta.
 * @returns Retorna um objeto com o status 200 e as informações climáticas, ou um objeto com o status 500 e uma mensagem de erro.
 */
export const getWeather = async (req: Request, res: Response): Promise<any> => {
	const { latitude, longitude } = req.body;

	if (!latitude || !longitude) {
		return res.status(400).json({ message: "Latitude e longitude são obrigatórias." });
	}

	try {
		// Busca as informações climáticas para as coordenadas recebidas
		const weatherData = await getWeatherByCoordinates(latitude, longitude);
		// Retorna as informações climáticas com sucesso
		res.status(200).json(weatherData);
	} catch (error: any) {
		// Caso ocorra um erro interno do servidor, retorna um objeto com o status 500 e uma mensagem de erro.
		res.status(500).json({ message: error.message });
	}
};
