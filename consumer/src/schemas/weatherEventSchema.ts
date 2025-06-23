import { z } from 'zod';

export const weatherEventSchema = z.object({
  city: z.string(),
  timestamp: z.string(),
  temperature: z.number(),
  windspeed: z.number(),
  winddirection: z.number(),
});

export type WeatherEvent = z.infer<typeof weatherEventSchema>;
