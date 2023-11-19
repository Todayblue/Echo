import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { communitySubscriptionValidator } from "@/lib/validators/communitySubscription";
import { z } from "zod";

export async function POST(req: Request) {
  try {
  const session = await getAuthSession();
    const body = await req.json();
    const { communityId } =
      communitySubscriptionValidator.parse(body);

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

    // check if user has already subscribed to community
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id
      },
    });

    if (subscriptionExists) {
      return new Response("You've already subscribed to this community", {
        status: 400,
      });
    }

    // create community and associate it with the user
    await prisma.subscription.create({
      data: {
        communityId,
        userId: session.user.id,
      },
    });

    return new Response(communityId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not subscribe to community at this time. Please try later",
      { status: 500 }
    );
  }
}
