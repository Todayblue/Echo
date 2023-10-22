import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  subCommunityId: z.string({ required_error: "Community is required" }),
  content: z.any(),
  authorId: z.string({ required_error: "Author is required" }),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
