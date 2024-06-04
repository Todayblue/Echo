import {z} from "zod";
import prisma from "@/lib/prisma";
import {Session} from "next-auth";
import {getAuthSession} from "@/lib/auth";
import {PostValidator} from "@/lib/validators/post";
import {generateSlug} from "@/lib/slugtify";
import {getSortByPosts, getTimeRange} from "@/lib/utils";
import {calSkip} from "@/lib/calSkip";
import {getSortBy} from "@/lib/utils";
import {SearchPostParams} from "@/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams: SearchPostParams = {
    community: url.searchParams.get("community") || "",
    limit: Number(url.searchParams.get("limit") || 5),
    page: Number(url.searchParams.get("page") || 1),
    time: url.searchParams.get("time") as
      | "year"
      | "month"
      | "week"
      | "day"
      | "hour"
      | null,
    sort: url.searchParams.get("sort") as "new" | "comments" | "votes" | null,
  };
  const {page, limit, community, time, sort} = searchParams;
  const skip = calSkip(page, limit);
  const {start, end} = getTimeRange(time);
  const {sortBy, whereClause} = getSortByPosts(community, sort, start, end);

  const posts = await prisma.post.findMany({
    where: whereClause,
    include: {
      community: true,
      comments: true,
      votes: true,
      author: true,
      _count: true,
    },
    skip,
    take: limit,
    orderBy: sortBy,
  });

  return new Response(JSON.stringify(posts));
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const {title, content, communityId, imageUrl, videoUrl, latlong} =
      PostValidator.parse(body);

    if (!session?.user) {
      return new Response("Unauthorized", {status: 401});
    }

    let latitude = "";
    let longitude = "";

    if (latlong != null && latlong.length > 0) {
      const latlongSplit = latlong.split(",");
      latitude = latlongSplit[0];
      longitude = latlongSplit[1];
    }

    // verify user is subscribed to passed communityId id
    const subscription = await prisma.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return new Response(
        "You are not subscribed to this community. Please subscribe to post.",
        {status: 403}
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: session.user.id,
        communityId: communityId,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        latitude: latitude,
        longitude: longitude,
        slug: generateSlug(title),
      },
      include: {
        community: true,
      },
    });

    return Response.json({post, communitySlug: post.community.slug});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {status: 400});
    }

    return new Response("error", {status: 500});
  }
}
