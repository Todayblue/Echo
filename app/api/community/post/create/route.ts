import prisma from "@/lib/prisma";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { generateSlug } from "@/lib/slugtify";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    const authorId = session?.user.id;

    const body = await req.json();

    const { title, content, communityId, imageUrl } = PostValidator.parse(body);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!authorId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // verify user is subscribed to passed communityId id
    const subscription = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: authorId,
      },
    });

    if (!subscription) {
      return new Response(
        "You are not subscribed to this community. Please subscribe to post.",
        { status: 403 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content:content,
        authorId: authorId,
        communityId: communityId,
        imageUrl: imageUrl,
        slug:generateSlug(title),
      },
      include: {
        community: true,
      },
    });

    return Response.json({ post, communityName: post.community.name });
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
