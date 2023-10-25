import prisma from "@/lib/prisma";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";
import slugify from "slugify";
import cuid from "cuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, subCommunityId, authorId } =
      PostValidator.parse(body);

    if (!authorId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify user is subscribed to passed subCommunityId id
    const subscription = await prisma.subscription.findFirst({
      where: {
        subCommunityId,
        userId: authorId,
      },
    });

    if (!subscription) {
      return new Response(
        "You are not subscribed to this community. Please subscribe to post.",
        { status: 403 }
      );
    }

    const id = cuid();
    const slug = `${slugify(title, { lower: true })}-${id}`;

    const post = await prisma.post.create({
      data: {
        id,
        title,
        content,
        authorId: authorId,
        subCommunityId,
        slug,
      },
      include: {
        subCommunity: true,
      },
    });

    return Response.json({ post, subCommunityName: post.subCommunity.name });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
