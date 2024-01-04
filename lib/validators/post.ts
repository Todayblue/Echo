import { z } from "zod";

export const PostValidator = z.object({
  communityId: z.string({ required_error: "Community is required" }),
  imageUrl: z.string().optional(),
  title: z
    .string({ required_error: "Title is required" })
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.any(),
});

export const PostSchema = z.object({
  id: z.string(),
  slug: z.string().nullable(),
  title: z.string(),
  content: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string(),
  subCommunityId: z.string(),
  comments: z.array(z.unknown()), // Define CommentSchema if needed
  votes: z.array(z.unknown()), // Define VoteSchema if needed
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
