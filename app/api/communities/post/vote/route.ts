import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostVoteValidator } from "@/lib/validators/vote";
import z from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: userId } = session.user;

    const existingUserVote = await prisma.vote.findFirst({
      where: {
        userId,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    let votesAmount = 0;

    if (existingUserVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingUserVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId,
            },
          },
        });
      } else {
        await prisma.vote.update({
          where: {
            userId_postId: {
              postId,
              userId,
            },
          },
          data: {
            type: voteType,
          },
        });
      }
    } else {
      await prisma.vote.create({
        data: {
          type: voteType,
          userId,
          postId,
        },
      });
    }

    votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    return new Response("OK");
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
