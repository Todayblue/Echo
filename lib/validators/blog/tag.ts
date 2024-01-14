import { z } from "zod";

export const TagValidator = z.object({
  name: z.string().min(3).max(21),
});

export type TagPayload = z.infer<typeof TagValidator>;
