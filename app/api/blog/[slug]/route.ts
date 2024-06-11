import {calSkip} from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(
  request: Request,
  {params}: {params: {slug: string}}
) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");

    if (!page || !limit) {
      throw new Error("Both 'page' and 'limit' parameters are required.");
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const skip = calSkip(parsedPage, parsedLimit);

    let whereCondition = {};
    if (params.slug !== "all") {
      whereCondition = {
        tags: {
          some: {
            slug: {
              contains: params.slug,
            },
          },
        },
      };
    }

    const blogs = await prisma.blog.findMany({
      where: whereCondition,
      include: {
        author: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: parsedLimit,
    });

    return NextResponse.json(
      {message: "GET Blog successfully", blogs},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json({message: "Can't GET Blog", error}, {status: 500});
  }
}

export async function DELETE(
  request: Request,
  {params}: {params: {slug: string}}
) {
  const blogSlug = params.slug;
  try {
    const deleteBlog = await prisma.blog.delete({
      where: {
        slug: blogSlug,
      },
    });
    return NextResponse.json({message: "Success", deleteBlog}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "Fail", error}, {status: 500});
  }
}