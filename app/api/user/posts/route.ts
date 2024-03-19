import { getAuthSession } from "@/lib/auth";
import { calSkip } from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const searchParams = req.nextUrl.searchParams;
  const limitString = searchParams.get("limit");
  const pageString = searchParams.get("page");
  const page = Number(pageString)
  const limit = Number(limitString)

  const skip = calSkip(page, limit);

  const posts = await prisma.post.findMany({
    include: {
      community: true,
      votes: true,
      author: true,
      comments: true,
    },
    where: {
      authorId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    take: limit,
  });

  return NextResponse.json(posts);
}
