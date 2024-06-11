import {z} from "zod";

export const CommunityValidator = z.object({
  id: z.string().optional(),
  name: z
    .string({required_error: "Please fill in community name"})
    .min(3)
    .max(21),
  title: z
    .string({required_error: "Please fill in community title"})
    .min(3)
    .max(100),
  description: z.string(),
  profileImage: z.string({required_error: "Please upload community image"}),
  isActive: z.boolean().default(false),
});

export const CommunitySubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;
