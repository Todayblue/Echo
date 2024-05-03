import {z} from "zod";
import prisma from "@/lib/prisma";
import {Session} from "next-auth";
import {getAuthSession} from "@/lib/auth";
import {PostValidator} from "@/lib/validators/post";
import {generateSlug} from "@/lib/slugtify";

const validateParams = async (req: Request) => {
  const url = new URL(req.url);

  const params = await z
    .object({
      limit: z.string(),
      page: z.string(),
      community: z.string().nullish().optional(),
    })
    .parse({
      community: url.searchParams.get("community"),
      limit: url.searchParams.get("limit"),
      page: url.searchParams.get("page"),
    });

  return params;
};

const getPostsWhereClause = async (
  session: Session | null,
  community: string | null | undefined
) => {
  let whereClause = {};

  if (community) {
    whereClause = {
      community: {
        slug: community,
      },
    };
  } else if (session) {
    const followedcommunityIds = await prisma.subscription
      .findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          community: true,
        },
      })
      .then((sub) => sub.map((sub) => sub.communityId));

    whereClause = {
      community: {
        id: {
          in: followedcommunityIds,
        },
      },
    };
  }

  return whereClause;
};

export async function GET(req: Request) {
  const params = await validateParams(req);
  const session = await getAuthSession();
  const whereClause = await getPostsWhereClause(session, params.community);

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      community: true,
      votes: true,
      author: true,
      comments: true,
    },
    where: whereClause,
  });

  return new Response(JSON.stringify(posts));
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    const body = await req.json();

    const {title, content, communityId, imageUrl, videoUrl, latlong} =
      PostValidator.parse(body);

    let latitude = 0;
    let longitude = 0;

    if (!session?.user) {
      return new Response("Unauthorized", {status: 401});
    }

    if (latlong != null && latlong.length > 0) {
      const latlongSplit = latlong.split(",");
      latitude = Number(latlongSplit[0]);
      longitude = Number(latlongSplit[1]);
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
        longitude: latitude,
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

    return new Response(
      "Could not post to subreddit at this time. Please try later",
      {status: 500}
    );
  }
}
