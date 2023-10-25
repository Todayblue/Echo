import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subCommunity: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      (sub) => sub.subCommunityId
    );
  }

  try {
    const { limit, page, subcommunity } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subcommunity: z.string().nullish().optional(),
      })
      .parse({
        subcommunity: url.searchParams.get("subcommunity"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subcommunity) {
      whereClause = {
        subCommunity: {
          name: subcommunity,
        },
      };
    } else if (session) {
      whereClause = {
        subCommunity: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await prisma.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subCommunity: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
