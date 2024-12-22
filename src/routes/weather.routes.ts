import { Router } from "express";
import { getWeather } from "../controllers/weather.controller";
import { validate } from "../middlewares";
import { weatherSchema } from "../schemas/weather/weather";

const router = Router();

router.post("/weather", validate(weatherSchema), getWeather);

export default router;
