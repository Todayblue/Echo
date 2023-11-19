import { z } from "zod";
import { PostValidator } from '@/lib/validators/post';

export const communitySubscriptionValidator = z.object({
  communityId: z.string(),
});

export const communityValidator = z.object({
  name: z.string().min(3).max(21),
});

export type CreatecommunityPayload = z.infer<typeof communityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof communitySubscriptionValidator
>;
