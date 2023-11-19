import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";
import { z } from "zod";

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
        name: community,
      },
    };
  } else if (session) {
    const followedCommunitiesIds = await prisma.subscription
      .findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          community: true
        },
      })
      .then((sub) => sub.map((sub) => sub.communityId));

    whereClause = {
      community: {
        id: {
          in: followedCommunitiesIds,
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
    take: parseInt(params.limit),
    skip: (parseInt(params.page) - 1) * parseInt(params.limit), // skip should start from 0 for page 1
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
