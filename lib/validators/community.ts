import { z } from "zod";

export const CommunityValidator = z.object({
  name: z
    .string({ required_error: "Please fill in community name" })
    .min(3)
    .max(21),
  title: z
    .string({ required_error: "Please fill in community title" })
    .min(3)
    .max(100),
  description: z.string({ required_error: "Please fill in community description" }).max(300),
  profileImage: z.string({ required_error: "Please upload community image" }),
});

export const CommunitySubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;
