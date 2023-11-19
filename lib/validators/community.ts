import { z } from "zod";
import { SubscriptionSchema } from "./subscription";
import { PostSchema } from "./post";

export const CommunityValidator = z.object({
  name: z.string().min(3).max(21),
});

export const CommunitySubscriptionValidator = z.object({
  subredditId: z.string(),
});

// export const CommunitySchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   slug: z.string().nullable(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   creatorId: z.string(),
//   rule: z.array(RuleSchema),
//   posts: z.array(PostSchema),
//   subscribers: z.array(SubscriptionSchema),
// });

// export const CommunityQuery = CommunitySchema.omit({
//   rule: true,
//   posts: true,
//   subscribers: true
// });

// export type CommunityQueryType = z.infer<typeof CommunityQuery>;
// export type CommunityType = z.infer<typeof CommunitySchema>;
export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;
