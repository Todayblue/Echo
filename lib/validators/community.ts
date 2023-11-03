import { z } from "zod";
import { SubCommunitySubscriptionValidator } from "./subCommunitySubscription";
import { PostValidator } from "./post";
import { UserValidator } from './user';
import { RuleValidator } from "./rule";

export const CommunityValidator = z.object({
  id: z.string(),
  creator: UserValidator,
  post: PostValidator,
  name: z.string(),
  subscribers: SubCommunitySubscriptionValidator,
  rule: RuleValidator,
});

export type CommunityCreationRequest = z.infer<typeof CommunityValidator>;
