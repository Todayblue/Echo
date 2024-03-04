import { z } from "zod";

export const TagValidator = z.object({
  name: z.string()
});

export type TagPayload = z.infer<typeof TagValidator>;
