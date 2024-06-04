import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {generateSlug} from "@/lib/slugtify";
import {CommunityValidator} from "@/lib/validators/community";
import {NextResponse} from "next/server";
import {z} from "zod";

export async function GET() {
  try {
    const community = await prisma.community.findMany({
      where: {
        isActive: true,
      },
      include: {
        subscribers: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not get community", error},
      {status: 500}
    );
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {status: 401});
  }

  try {
    const body = await req.json();
    const {name, description, title, profileImage, isActive} =
      CommunityValidator.parse(body);

    const slug = generateSlug(name);

    // check if subreddit already exists
    const communityExists = await prisma.community.findFirst({
      where: {
        slug: slug,
      },
    });

    if (communityExists) {
      return new Response("Community already exists", {status: 409});
    }

    // create community and associate it with the user
    const community = await prisma.community.create({
      data: {
        name,
        slug: slug,
        profileImage: profileImage,
        title: title,
        description: description,
        creatorId: session.user.id,
        isActive: isActive,
      },
    });

    // creator also has to be subscribed
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });
    return NextResponse.json(community.slug);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {status: 422});
    }
    return new Response("Could not create community", {status: 500});
  }
}
