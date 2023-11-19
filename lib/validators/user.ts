import { z } from "zod";

export const UserValidator = z.object({
  id: z.string({ required_error: "userId is required" }),
  name: z
    .string()
    .min(10, {
      message: "name must be at least 10 characters long",
    })
    .max(40, {
      message: "name must be less than 40 characters long",
    }),
  email: z
    .string(
      {required_error: "email is required"}
    )
    .min(10, {
      message: "email must be at least 10 characters long",
    })
    .max(40, {
      message: "email must be less than 40 characters long",
    }),
});

export type UserreationRequest = z.infer<typeof UserValidator>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  username: z.string().nullable(),
  role: z.enum(["ADMIN", "USER"]),
  image: z.string().nullable(),
  Comment: z.array(z.unknown()), // Define CommentSchema if needed
  CommentVote: z.array(z.unknown()), // Define CommentVoteSchema if needed
  Post: z.array(z.unknown()), // Define PostSchema if needed
  // Profile: z.object(ProfileSchema),
  createdcommunity: z.array(z.unknown()), // Define communitySchema if needed
  subscriptions: z.array(z.unknown()), // Define SubscriptionSchema if needed
  votes: z.array(z.unknown()), // Define VoteSchema if needed
  rule: z.array(z.unknown()), // Define RuleSchema if needed
});