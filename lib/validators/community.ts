import { z } from "zod";
import { SubscriptionSchema } from "./subscription";
import { PostSchema } from "./post";

export const CommunityValidator = z.object({
  name: z.string().min(3).max(21),
  title: z.string().min(3).max(100),
  description: z.string().max(300),
  profileImage: z.string()
});

export const CommunitySubscriptionValidator = z.object({
  subredditId: z.string(),
});


// export type CommunityQueryType = z.infer<typeof CommunityQuery>;
// export type CommunityType = z.infer<typeof CommunitySchema>;
export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;
