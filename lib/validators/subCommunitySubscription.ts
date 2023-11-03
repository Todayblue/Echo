import { z } from "zod";
import { PostValidator } from '@/lib/validators/post';



export const SubCommunitySubscriptionValidator = z.object({
  subCommunityId: z.string(),
  userId: z.string(),
});

export const SubCommunityValidator = z.object({
  name: z.string().min(3).max(21),
});

export type CreateSubCommunityPayload = z.infer<typeof SubCommunityValidator>;
export type SubscribeToSubCommunityPayload = z.infer<
  typeof SubCommunitySubscriptionValidator
>;
