import prisma from "@/lib/prisma";
import { communitySubscriptionValidator } from "@/lib/validators/communitySubscription";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { communityId, userId } =
      communitySubscriptionValidator.parse(body);

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // check if user has already subscribed or not
    const subCommunityExists = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: userId,
      },
    });

    if (!subCommunityExists) {
      return new Response(
        "You've not been subscribed to this community, yet.",
        {
          status: 400,
        }
      );
    }

    // create subreddit and associate it with the user
    await prisma.subscription.delete({
      where: {
        userId_communityId: {
          communityId,
          userId,
        },
      },
    });

    return new Response(communityId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not unsubscribe from Comunity at this time. Please try later",
      { status: 500 }
    );
  }
}
