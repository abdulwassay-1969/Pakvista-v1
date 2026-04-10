'use server';
/**
 * @fileOverview A travel plan generating AI agent.
 *
 * - generatePlan - A function that handles generating a travel plan.
 * - TravelPlannerInput - The input type for the generatePlan function.
 * - TravelPlannerOutput - The return type for the generatePlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { computePlannerRouteDistance } from '@/lib/planner-distance';

const TravelPlannerInputSchema = z.object({
  destination: z.string().describe('The province or major city in Pakistan.'),
  duration: z.number().describe('The duration of the trip in days.'),
  startDate: z.string().describe('Preferred trip start date in YYYY-MM-DD format.'),
  travelers: z.number().describe('Total number of travelers.'),
  travelStyle: z.string().describe('Travel style such as solo, couple, family, or friends.'),
  pace: z.string().describe('Preferred trip pace such as relaxed, balanced, or packed.'),
  transport: z
    .string()
    .describe(
      'One of: road-trip (car/van on roads only, no flights), public-transport (bus/train/metro/local, no flights unless notes say otherwise), mixed (road + flight allowed). The itinerary must strictly follow this.'
    ),
  accommodation: z.string().describe('Preferred accommodation style.'),
  currency: z.string().describe('Preferred currency code for budget output, e.g., PKR, USD, EUR.'),
  interests: z
    .array(z.string())
    .describe('A list of interests for the trip.'),
  budget: z
    .string()
    .describe(
      'The budget for the trip (e.g., budget-friendly, mid-range, luxury).'
    ),
  mustVisit: z.array(z.string()).describe('Places the traveler definitely wants to include.'),
  dietaryNeeds: z.string().describe('Any food preference or dietary requirement.'),
  notes: z.string().describe('Additional custom notes or constraints.'),
});
export type TravelPlannerInput = z.infer<typeof TravelPlannerInputSchema>;

const TravelPlannerOutputSchema = z.object({
  tripTitle: z.string().describe('A creative and catchy title for the trip.'),
  destination: z.string().describe('The main destination of the trip.'),
  duration: z.number().describe('The duration of the trip in days.'),
  budgetSummary: z.string().describe('A short budget estimate and spending guidance.'),
  budgetBreakdown: z.object({
    currency: z.string().describe('Currency for all totals.'),
    accommodation: z.number().describe('Total accommodation estimate.'),
    food: z.number().describe('Total food estimate.'),
    localTransport: z.number().describe('Total local transport estimate.'),
    activities: z.number().describe('Total activities estimate.'),
    contingency: z.number().describe('Suggested contingency reserve.'),
    grandTotal: z.number().describe('Estimated full trip total.'),
    perPersonTotal: z.number().describe('Estimated trip total per traveler.'),
    estimatedRouteKm: z
      .number()
      .optional()
      .describe('Approximate route distance between destination and must-visit stops (km).'),
    routeDistanceMethod: z
      .enum(['osrm', 'haversine', 'none'])
      .optional()
      .describe('How route distance was estimated.'),
  }),
  transportPlan: z.string().describe('How to move between places during the trip.'),
  tips: z.array(z.string()).describe('Helpful local travel tips and safety guidance.'),
  dailyPlan: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      title: z.string().describe('A title for the day\'s activities.'),
      details: z
        .string()
        .describe('A detailed plan for the day, including activities, sights, and food recommendations.'),
    })
  ),
});
export type TravelPlannerOutput = z.infer<typeof TravelPlannerOutputSchema>;

const plannerPrompt = ai.definePrompt({
  name: 'plannerPrompt',
  input: { schema: TravelPlannerInputSchema },
  output: { schema: TravelPlannerOutputSchema },
  prompt: `You are an expert travel planner specializing in tourism in Pakistan. 
    Your task is to create a personalized travel itinerary based on user preferences.

    User Preferences:
    - Destination: {{{destination}}}
    - Trip Duration: {{{duration}}} days
    - Start Date: {{{startDate}}}
    - Travelers: {{{travelers}}}
    - Travel Style: {{{travelStyle}}}
    - Pace: {{{pace}}}
    - Transport: {{{transport}}}
    - Accommodation: {{{accommodation}}}
    - Currency: {{{currency}}}
    - Interests: {{{interests}}}
    - Budget: {{{budget}}}
    - Must Visit: {{{mustVisit}}}
    - Dietary Needs: {{{dietaryNeeds}}}
    - Notes: {{{notes}}}

    CRITICAL — Preferred Transport (field "transport") must match ALL of the following everywhere:
    - dailyPlan[].details, transportPlan, budgetSummary, and tips must stay consistent with this choice.
    - If transport is "road-trip": assume travel by private or hired car / van on roads only. Describe driving routes, road time, fuel/rest stops, and parking where relevant. Do NOT mention flights, airports, airlines, boarding, domestic air routes, or flying between cities.
    - If transport is "public-transport": assume buses, coaches, trains, metro (where available), and local rickshaws or ride-hail for short hops. Do NOT mention flights, airports, or airlines unless the user explicitly asked for air travel in Notes.
    - If transport is "mixed": road plus flight segments are allowed; you may reference airports and flights when logical for long legs.

    Generate a creative and practical day-by-day itinerary. For each day, provide a title and a detailed plan. 
    The plan should include suggestions for activities, historical sites, natural landmarks, and local cuisine that match the user's interests and budget.
    Include:
    1) A short budget summary (aligned with the transport mode above — no flight costs if transport is road-trip or public-transport).
    2) A transport plan between key stops that only uses modes allowed for the selected transport value.
    3) 4-6 local tips (safety, clothing, connectivity, local etiquette, weather readiness).
    Keep recommendations realistic for Pakistan and aligned with the selected pace.
    Ensure the generated plan is for the specified duration.
    The output should be a JSON object that conforms to the specified output schema.`,
});

const PLANNER_MODEL_FALLBACKS = [
  'googleai/gemini-2.0-flash',
  'googleai/gemini-2.5-flash-lite',
  'googleai/gemini-2.0-flash-lite',
] as const;

function isTransientGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    /high demand|temporarily|try again|overloaded|Service Unavailable/i.test(msg)
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function runPlannerPrompt(input: TravelPlannerInput) {
  let lastErr: unknown;
  for (const model of PLANNER_MODEL_FALLBACKS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await plannerPrompt(input, { model });
        if (res.output) return res;
        lastErr = new Error('Failed to generate a travel plan.');
      } catch (e) {
        lastErr = e;
        if (!isTransientGeminiError(e)) throw e;
        if (attempt < 3) {
          await sleep(1000 * 2 ** attempt);
        }
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(
        'Gemini is temporarily unavailable. Please wait a minute and try again.'
      );
}

const plannerFlow = ai.defineFlow(
  {
    name: 'plannerFlow',
    inputSchema: TravelPlannerInputSchema,
    outputSchema: TravelPlannerOutputSchema,
  },
  async (input) => {
    const { output } = await runPlannerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a travel plan.');
    }

    const nights = Math.max(1, input.duration - 1);
    const travelers = Math.max(1, input.travelers);

    const accommodationBaseByType: Record<string, number> = {
      "budget-guesthouse": 5000,
      "comfortable-hotel": 11000,
      "premium-resort": 22000,
    };
    const accommodationBudgetMultiplier: Record<string, number> = {
      "budget-friendly": 0.85,
      "mid-range": 1,
      "luxury": 1.5,
    };
    const foodPerPersonByBudget: Record<string, number> = {
      "budget-friendly": 1800,
      "mid-range": 3500,
      "luxury": 7000,
    };
    const activitiesPerPersonByBudget: Record<string, number> = {
      "budget-friendly": 1200,
      "mid-range": 2600,
      "luxury": 5200,
    };
    const transportPerDayByMode: Record<string, number> = {
      "road-trip": 8500,
      "public-transport": 3000,
      "mixed": 13000,
    };

    const accBase = accommodationBaseByType[input.accommodation] ?? 11000;
    const accMul = accommodationBudgetMultiplier[input.budget] ?? 1;
    const foodPerPerson = foodPerPersonByBudget[input.budget] ?? 3500;
    const activitiesPerPerson = activitiesPerPersonByBudget[input.budget] ?? 2600;
    const transportPerDay = transportPerDayByMode[input.transport] ?? 8500;

    const routeDist = await computePlannerRouteDistance(
      input.destination,
      input.mustVisit ?? []
    );
    const effectiveKm =
      routeDist.waypoints.length >= 2
        ? routeDist.roadKm ?? routeDist.straightLineKm
        : 0;
    const perKmPkr: Record<string, number> = {
      'road-trip': 28,
      'public-transport': 9,
      mixed: 36,
    };
    const pk = perKmPkr[input.transport] ?? 28;
    const baseTransport = transportPerDay * input.duration;
    let localTransportTotal: number;
    if (effectiveKm < 1 || routeDist.waypoints.length < 2) {
      localTransportTotal = Math.round(baseTransport);
    } else {
      const kmComponent = effectiveKm * pk;
      localTransportTotal = Math.round(baseTransport * 0.22 + kmComponent);
      localTransportTotal = Math.max(
        localTransportTotal,
        Math.round(baseTransport * 0.45)
      );
    }

    const accommodationTotal = Math.round(accBase * accMul * nights);
    const foodTotal = Math.round(foodPerPerson * travelers * input.duration);
    const activitiesTotal = Math.round(activitiesPerPerson * travelers * input.duration);
    const subtotal = accommodationTotal + foodTotal + activitiesTotal + localTransportTotal;
    const contingency = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + contingency;
    const perPersonTotal = Math.round(grandTotal / travelers);

    const FX_FROM_PKR: Record<string, number> = {
      PKR: 1,
      USD: 1 / 278,
      EUR: 1 / 302,
      GBP: 1 / 354,
      AED: 1 / 75.7,
      SAR: 1 / 74,
      CNY: 1 / 38.6,
    };
    const currency = (input.currency || "PKR").toUpperCase();
    const fx = FX_FROM_PKR[currency] ?? 1;
    const convert = (value: number) => Math.round(value * fx);
    const formatMoney = (value: number) => value.toLocaleString("en-PK");

    const accommodationConverted = convert(accommodationTotal);
    const foodConverted = convert(foodTotal);
    const localTransportConverted = convert(localTransportTotal);
    const activitiesConverted = convert(activitiesTotal);
    const contingencyConverted = convert(contingency);
    const grandTotalConverted = convert(grandTotal);
    const perPersonConverted = convert(perPersonTotal);
    const distNote =
      routeDist.waypoints.length >= 2 && effectiveKm >= 1
        ? ` Route distance ~${Math.round(effectiveKm)} km (${routeDist.method === 'osrm' ? 'road' : routeDist.method === 'haversine' ? 'straight-line' : 'n/a'}).`
        : '';
    const budgetSummary =
      `Estimated ${currency} ${formatMoney(grandTotalConverted)} total for ${travelers} traveler(s) ` +
      `(${currency} ${formatMoney(perPersonConverted)} per person), including 10% contingency.` +
      distNote;

    return {
      ...output,
      budgetSummary,
      budgetBreakdown: {
        currency,
        accommodation: accommodationConverted,
        food: foodConverted,
        localTransport: localTransportConverted,
        activities: activitiesConverted,
        contingency: contingencyConverted,
        grandTotal: grandTotalConverted,
        perPersonTotal: perPersonConverted,
        estimatedRouteKm:
          routeDist.waypoints.length >= 2 && effectiveKm >= 1
            ? Math.round(effectiveKm)
            : undefined,
        routeDistanceMethod:
          routeDist.waypoints.length >= 2 && effectiveKm >= 1
            ? routeDist.method
            : 'none',
      },
    };
  }
);

export async function generatePlan(
  input: TravelPlannerInput
): Promise<TravelPlannerOutput> {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY
  );
  if (!hasKey) {
    throw new Error(
      "Gemini API key is not set. Add GEMINI_API_KEY (or GOOGLE_API_KEY) to .env.local in the project root, restart the dev server, then try again. Create a key: https://aistudio.google.com/apikey"
    );
  }
  return plannerFlow(input);
}
