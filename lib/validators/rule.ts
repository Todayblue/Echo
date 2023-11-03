import { z } from "zod";

export const RuleValidator = z.object({
  subCommunityId: z.string({ required_error: "Community is required" }),
  title: z
    .string({
      required_error: "title is required",
    })
    .min(6, {
      message: "title must be at least 6 characters long",
    })
    .max(40, {
      message: "title must be less than 40 characters long",
    }),
  description: z
    .string()
    .min(30, {
      message: "description must be at least 30 characters long",
    })
    .max(200, {
      message: "description must be less than 200 characters long",
    }),
});

export type RuleCreationRequest = z.infer<typeof RuleValidator>;
