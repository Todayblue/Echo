import {getAuthSession} from "@/lib/auth";
import {calSkip} from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import {getSortByAndWhereClause, getTimeRange} from "@/lib/utils";
import { SearchUserPostParams } from "@/types";

type SearchType = "posts" | "upvote" | "downvote" | "community" | null;
type TimeRange = "year" | "month" | "week" | "day" | "hour" | null;
type SortType = "new" | "comments" | "votes" | null | undefined;

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
