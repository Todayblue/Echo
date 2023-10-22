import { z } from "zod";

export const SubCommunityValidator = z.object({
  creatorId: z.string(),
  name: z.string().min(3).max(21),
});

export const SubCommunitySubscriptionValidator = z.object({
  subCommunityId: z.string(),
  userId: z.string(),
});

export type CreateSubCommunityPayload = z.infer<typeof SubCommunityValidator>;
export type SubscribeToSubCommunityPayload = z.infer<
  typeof SubCommunitySubscriptionValidator
>;
