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

    // check if user has already subscribed or not
    const subCommunityExists = await prisma.subscription.findFirst({
      where: {
        subCommunityId,
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
        userId_subCommunityId: {
          subCommunityId,
          userId,
        },
      },
    });

    return new Response(subCommunityId);
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
