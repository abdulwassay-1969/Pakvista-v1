'use server';

import { getWeatherFlow, type WeatherInput, type WeatherData } from "@/ai/flows/weather-flow";
import { generatePlan, type TravelPlannerInput, type TravelPlannerOutput } from "@/ai/flows/planner-flow";

export async function getWeather(input: WeatherInput): Promise<WeatherData> {
    return await getWeatherFlow(input);
}

export async function getTravelPlan(input: TravelPlannerInput): Promise<TravelPlannerOutput> {
    return await generatePlan(input);
}
