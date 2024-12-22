export interface WeatherData {
	temperature: string;
	condition: string;
	recommendation: string;
}

export interface OpenWeatherMapResponse {
	main: {
		temp: number;
	};
	weather: {
		description: string;
	}[];
	cod: number;
	message: string;
}
