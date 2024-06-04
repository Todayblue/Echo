import {getAuthSession} from "@/lib/auth";
import {calSkip} from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import {getTimeRange} from "@/lib/utils";
import {SearchPostParams, SearchUserPostParams} from "@/types";
import {Community, Subscription, VoteType} from "@prisma/client";

export async function GET(req: Request) {
  const session = await getAuthSession();

  const url = new URL(req.url);
  const searchParams: SearchUserPostParams = {
    searchType: url.searchParams.get("type") as SearchType,
    limit: Number(url.searchParams.get("limit") || 5),
    page: Number(url.searchParams.get("page") || 1),
    time: url.searchParams.get("time") as TimeRange,
    sort: url.searchParams.get("sort") as SortType,
  };

  const followedCommunities = await getFollowedCommunities(
    session?.user.id,
    searchParams.searchType
  );

  const {page, limit, time, sort, searchType} = searchParams;
  const skip = calSkip(page, limit);
  const {start, end} = getTimeRange(time);

  const {sortBy, whereClause} = getSortByAndWhereClause(
    session?.user.id,
    followedCommunities,
    searchType,
    sort,
    start,
    end
  );

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

type SearchType = "posts" | "upvote" | "downvote" | "community" | null;
type TimeRange = "year" | "month" | "week" | "day" | "hour" | null;
type SortType = "new" | "comments" | "votes" | null | undefined;

type FollowedCommunities = Subscription & {
  community: Community;
};

const getFollowedCommunities = async (
  userId: string | undefined,
  searchType: SearchType
) => {
  if (searchType === "community" && userId) {
    return await prisma.subscription.findMany({
      where: {userId},
      include: {community: true},
    });
  }
  return [];
};

export const getSortByAndWhereClause = (
  userId: string | null,
  followedCommunities: FollowedCommunities[] | [],
  searchType: SearchType,
  sort: SortType,
  start: Date,
  end: Date
) => {
  const whereClause: any = {createdAt: {gte: start, lte: end}};
  let sortBy: any = {};

  if (userId) {
    switch (searchType) {
      case "posts":
        whereClause.authorId = userId;
        break;
      case "upvote":
        whereClause.votes = {some: {userId, type: VoteType.UP}};
        break;
      case "downvote":
        whereClause.votes = {some: {userId, type: VoteType.DOWN}};
        break;
      case "community":
        if (followedCommunities) {
          whereClause.community = {
            id: {in: followedCommunities.map((com) => com.communityId)},
          };
        }
        break;
      default:
        break;
    }
  }

  switch (sort) {
    case "new":
      sortBy = {createdAt: "desc"};
      break;
    case "comments":
      sortBy = {comments: {_count: "desc"}};
      break;
    case "votes":
      sortBy = {votes: {_count: "desc"}};
      whereClause.votes = {
        every: {
          type: "UP",
        },
      };
      break;
    default:
      break;
  }

  return {sortBy, whereClause};
};
