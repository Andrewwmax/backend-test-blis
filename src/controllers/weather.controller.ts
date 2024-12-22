import { Request, Response } from "express";
import { getWeatherByCoordinates } from "../services/weather.service";

export const getWeather = async (req: Request, res: Response): Promise<any> => {
	const { latitude, longitude } = req.body;

	if (!latitude || !longitude) {
		return res.status(400).json({ message: "Latitude e longitude são obrigatórios." });
	}

	try {
		const weatherData = await getWeatherByCoordinates(latitude, longitude);
		res.status(200).json(weatherData);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};
