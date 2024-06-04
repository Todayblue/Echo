import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";
import {calSkip} from "@/lib/calSkip";
import {getSortBy, getTimeRange} from "@/lib/utils";

interface SearchParams {
  query: string;
  page: number;
  limit: number;
  type: "posts" | "communities";
  time: "year" | "month" | "week" | "day" | "hour" | null;
  sort: "relevance" | "new" | "comments" | "votes" | null;
}

async function performSearch(searchParams: SearchParams) {
  if (!searchParams.query || !searchParams.type) {
    return new Response("Invalid query parameters", {status: 400});
  }

  const {page, limit, type, time, sort, query} = searchParams;
  const skip = calSkip(page, limit);
  const {start, end} = getTimeRange(time);
  const {sortBy, whereClause} = getSortBy(sort, query, start, end);

  let results: any[] = [];
  switch (type) {
    case "posts":
      results = await searchPosts(skip, limit, sortBy, whereClause);
      break;
    case "communities":
      results = await searchCommunities(query, skip, limit);
      break;
    default:
      return new Response("Invalid search type", {status: 400});
  }
  return results;
}

async function searchPosts(
  skip: number,
  limit: number,
  sortBy: any,
  whereClause: any
) {
  return prisma.post.findMany({
    where: whereClause,
    include: {
      community: true,
      comments: true,
      votes: true,
      _count: true,
    },
    skip,
    take: limit,
    orderBy: sortBy,
  });
}

async function searchCommunities(query: string, skip: number, limit: number) {
  const searchTerms = query.split(" ");
  return prisma.community.findMany({
    where: {
      isActive: true,
      OR: searchTerms.map((term) => ({
        slug: {
          contains: term,
          mode: "insensitive",
        },
      })),
    },
    include: {
      _count: true,
    },
    skip,
    take: limit,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams: SearchParams = {
    query: url.searchParams.get("q") || "",
    type: (url.searchParams.get("type") as "posts" | "communities") || "posts",
    limit: Number(url.searchParams.get("limit") || 5),
    page: Number(url.searchParams.get("page") || 1),
    time: url.searchParams.get("time") as
      | "year"
      | "month"
      | "week"
      | "day"
      | "hour"
      | null,
    sort: url.searchParams.get("sort") as
      | "relevance"
      | "new"
      | "comments"
      | "votes"
      | null,
  };

  const results = await performSearch(searchParams);

  return NextResponse.json(results);
}
