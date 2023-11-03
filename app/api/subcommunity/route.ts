import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slugtify";
import { SubCommunityValidator } from "@/lib/validators/subCommunitySubscription";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const subCommunity = await prisma.subCommunity.findMany({
      include: {
        subscribers: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(subCommunity);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not get subCommunity", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = SubCommunityValidator.parse(body);

    const slug = generateSlug(name);

    // check if subreddit already exists
    const subCommunityExists = await prisma.subCommunity.findFirst({
      where: {
        slug: slug,
      },
    });

    if (subCommunityExists) {
      return new Response("SubCommunity already exists", { status: 409 });
    }

    // create subreddit and associate it with the user
    const subCommunity = await prisma.subCommunity.create({
      data: {
        name,
        slug: slug,
        creatorId: session.user.id,
      },
    });

    // creator also has to be subscribed
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subCommunityId: subCommunity.id,
      },
    });

    return NextResponse.json(subCommunity.slug);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not create subCommunity", { status: 500 });
  }
}
