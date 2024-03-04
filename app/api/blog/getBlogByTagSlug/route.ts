import { calSkip } from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (!page || !limit) {
    throw new Error("Both 'page' and 'limit' parameters are required.");
  }

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = calSkip(parsedPage, parsedLimit);

  try {
    const tagslug = params.slug;

    const tags = await prisma.tag.findFirst({
      where: {
        slug: tagslug,
      },
    });
    const blogs = await prisma.blog.findMany({
      skip: skip,
      take: parsedLimit,
      where: {
        tags: {
          some: {
            slug: tagslug,
          },
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });

    const blogCount = await prisma.blog.count({
      where: {
        tags: {
          some: {
            slug: tagslug,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "GET Tag successfully", blogs, tags, blogCount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't Tag User", error },
      { status: 500 }
    );
  }
}
