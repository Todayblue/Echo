import { z } from "zod";

export const RuleValidator = z.object({
  communityId: z.string(),
  title: z.string({
    required_error: "title is required",
  }),
  description: z.string({
    required_error: "description is required",
  }),
});

export const UpdateRuleValidator = z.object({
  title: z.string(),
  description: z.string(),
});

export type RuleCreationRequest = z.infer<typeof RuleValidator>;
export type RuleUpdationRequest = z.infer<typeof UpdateRuleValidator>;
