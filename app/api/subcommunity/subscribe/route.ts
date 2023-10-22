import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { SubCommunitySubscriptionValidator } from "@/lib/validators/subCommunitySubscription";
import { z } from "zod";

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { subCommunityId, userId } =
      SubCommunitySubscriptionValidator.parse(body);

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // check if user has already subscribed to subreddit
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subCommunityId,
        userId: userId,
      },
    });

    if (subscriptionExists) {
      return new Response("You've already subscribed to this subreddit", {
        status: 400,
      });
    }

    // create subreddit and associate it with the user
    await prisma.subscription.create({
      data: {
        subCommunityId,
        userId: userId,
      },
    });

    return new Response(subCommunityId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not subscribe to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
