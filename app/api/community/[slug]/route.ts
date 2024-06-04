import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {generateSlug} from "@/lib/slugtify";
import {CommunityValidator} from "@/lib/validators/community";

import {NextResponse} from "next/server";
import {z} from "zod";

export async function GET(
  request: Request,
  {params}: {params: {slug: string}}
) {
  try {
    const community = await prisma.community.findFirst({
      where: {
        slug: params.slug,
        isActive: true,
      },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json(
      {message: "Can't GET Community", error},
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
    const {name} = CommunityValidator.parse(body);

    const slug = generateSlug(name);

    // check if subreddit already exists
    const communityExists = await prisma.community.findFirst({
      where: {
        slug: slug,
      },
    });

    if (communityExists) {
      return new Response("community already exists", {status: 409});
    }

    // create subreddit and associate it with the user
    const community = await prisma.community.create({
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
        communityId: community.id,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {status: 422});
    }
    return new Response("Could not create community", {status: 500});
  }
}

export async function PATCH(
  request: Request,
  {params}: {params: {slug: string}}
) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {status: 401});
  }

  try {
    const body = await request.json();
    const {id, name, description, title, isActive, profileImage} =
      CommunityValidator.parse(body);

    const existingCommunity = await prisma.community.findUnique({
      where: {
        slug: params.slug,
      },
    });

    let currentSlug =
      existingCommunity?.name !== name ? generateSlug(name) : params.slug;

    // create community and associate it with the user
    const community = await prisma.community.update({
      where: {
        id: id,
      },
      data: {
        name,
        slug: currentSlug,
        profileImage: profileImage,
        title: title,
        description: description,
        isActive: isActive,
      },
    });

    if (existingCommunity?.isActive === false && isActive === true) {
      await prisma.notification.create({
        data: {
          message: `${existingCommunity.name} community is active now`,
          type: "COMMUNITY_APPROVED",
          herf: `/community/${existingCommunity.slug}`,
          userId: existingCommunity.creatorId,
        },
      });
    }

    return NextResponse.json(community);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {status: 422});
    }
    return new Response("Could not create community", {status: 500});
  }
}

export async function DELETE(
  request: Request,
  {params}: {params: {slug: string}}
) {
  try {
    const {slug} = params;

    const {id} = await prisma.community.findFirstOrThrow({
      where: {
        slug: slug,
      },
      select: {
        id: true,
      },
    });

    await prisma.subscription.deleteMany({
      where: {
        communityId: id,
      },
    });

    const deletedCommunity = await prisma.community.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {message: "Success", deletedCommunity},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(error);
  }
}
