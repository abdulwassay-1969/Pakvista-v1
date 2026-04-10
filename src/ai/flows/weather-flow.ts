
'use server';
/**
 * @fileOverview A weather fetching AI agent.
 *
 * - getWeatherFlow - A function that handles fetching weather data.
 * - WeatherInput - The input type for the getWeatherFlow function.
 * - WeatherData - The return type for the getWeatherFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { fetchWeatherData } from '@/lib/meteoblue';


const WeatherInputSchema = z.object({
  city: z.string().describe('The city to get the weather for.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const WeatherDataSchema = z.object({
  city: z.string(),
  current: z.object({
    temp: z.number(),
    description: z.string(),
    icon: z.string(),
  }),
  forecast: z.array(
    z.object({
      day: z.string(),
      high: z.number(),
      low: z.number(),
      icon: z.string(),
    })
  ),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;

const meteoblueFlow = ai.defineFlow(
  {
    name: 'meteoblueFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    return await fetchWeatherData(input);
  }
);

export async function getWeatherFlow(
  input: WeatherInput
): Promise<WeatherData> {
  return meteoblueFlow(input);
}
