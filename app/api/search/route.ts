import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

interface SearchParams {
  query: string | null;
  type: string | null;
}

async function performSearch(query: string | null, type: string | null) {
  if (!query) {
    return new Response("Invalid query", {status: 400});
  }

  let results: any[] = [];

  switch (type) {
    case "post":
      results = await prisma.post.findMany({
        where: {
          title: {
            search: query,
          },
        },
        include: {
          community: true,
          comments: true,
          votes: {
            where: {
              type: 'UP'
            },
          },
          _count: true,
        },
      });
      break;
    case "community":
      results = await prisma.community.findMany({
        where: {
          name: {
            search: query,
          },
        },
        include: {
          _count: true,
        },
      });
      break;
    case "comment":
      results = await prisma.comment.findMany({
        where: {
          text: {
            search: query,
          },
        },
        include: {
          _count: true,
        },
      });
      break;
    default:
      break;
  }

  return results;
}

export async function GET(req: Request) {
  const {query, type}: SearchParams = {
    query: new URL(req.url).searchParams.get("q"),
    type: new URL(req.url).searchParams.get("type"),
  };

  const results = await performSearch(query, type);

  console.log("🚀 ---------------------🚀");
  console.log("🚀 ~ results:", results);
  console.log("🚀 ---------------------🚀");

  return NextResponse.json(results);
}
