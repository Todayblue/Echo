import {getAuthSession} from "@/lib/auth";
import {calSkip} from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import {generateSlug} from "@/lib/slugtify";
import {BlogValidator} from "@/lib/validators/blog/blog";
import {NextResponse} from "next/server";
import {type NextRequest} from "next/server";

export async function GET(
  request: Request,
  {params}: {params: {slug: string}}
) {
  try {
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag");
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");

    if (!page || !limit) {
      throw new Error("Both 'page' and 'limit' parameters are required.");
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const skip = calSkip(parsedPage, parsedLimit);

    let whereCondition = {};
    if (tag !== "all") {
      whereCondition = {
        tags: {
          some: {
            slug: {
              contains: tag || "",
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

    const blogCount = await prisma.blog.count({
      where: whereCondition,
    });

    const data = {blogs, blogCount};

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({message: "Fail", error}, {status: 500});
  }
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  try {
    if (!session?.user) {
      return new Response("Unauthorized", {status: 401});
    }
    const body = await request.json();
    const {title, content, coverImage, tagIds} = BlogValidator.parse(body);

    const posts = await prisma.blog.create({
      data: {
        title: title,
        slug: generateSlug(title),
        content: content,
        coverImage: coverImage,
        authorId: session.user.id,
        tags: {
          connect: tagIds.map((tag) => ({id: tag})),
        },
      },
      include: {
        tags: true,
      },
    });
    return NextResponse.json(
      {message: "POST Blog successfully", posts},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json(
      {message: "Can not POST Blog", error},
      {status: 500}
    );
  }
}
