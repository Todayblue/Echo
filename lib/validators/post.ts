import { z } from "zod";

const latLongRegex =
  /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

export const PostValidator = z.object({
  communityId: z.string({required_error: "Please select community"}),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  title: z
    .string({required_error: "Please fill in post title"})
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(500, {
      message: "Title must be less than 500 characters long",
    }),
  content: z.any(),
  latlong: z
    .string()
    .regex(latLongRegex, {message: "Invalid latitude/longitude format"})
    .optional(),
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
