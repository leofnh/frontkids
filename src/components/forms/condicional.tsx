import { z } from "zod";

export const infoSendCondicional = z.object({
  cliente: z.string().min(1),
  id: z.string().optional(),
});

export type infoSendCondicional = z.infer<typeof infoSendCondicional>;
