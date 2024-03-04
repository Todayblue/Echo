import { getAuthSession } from "@/lib/auth";
import { calSkip } from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import { BlogValidator } from "@/lib/validators/blog/blog";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

async function getBlogs(tagId:string | null, skip:number, parsedLimit:number) {
  let whereCondition = {};

  if (tagId) {
    let id = parseInt(tagId)
    whereCondition = {
      tags: {
        some: {
          id: id,
        },
      },
    };
  }

  const [blogs, blogCount] = await Promise.all([
    prisma.blog.findMany({
      skip: skip,
      take: parsedLimit,
      include: {
        tags: true,
        author: true,
      },
      where: whereCondition,
    }),
    prisma.blog.count({
      where: whereCondition,
    }),
  ]);

  return { blogs, blogCount };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const tagId = searchParams.get("tagId");

    if (!page || !limit) {
      throw new Error("Both 'page' and 'limit' parameters are required.");
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit);
    const skip = calSkip(parsedPage, parsedLimit);

    const { blogs, blogCount } = await getBlogs(
      tagId,
      skip,
      parsedLimit
    );

    return NextResponse.json(
      { message: "GET Blog successfully", blogCount, blogs },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't GET Blog", error },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  const session = await getAuthSession();
  try {

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }
    const body = await request.json();
    const { title, content, coverImage, tagSlugs } = BlogValidator.parse(body);

    const slugify = require("slugify");
    const blogSlug: string = slugify(title).toLowerCase();

    const posts = await prisma.blog.create({
      data: {
        title: title,
        slug: blogSlug,
        content: content,
        coverImage: coverImage,
        authorId: session.user.id,
        tags: {
          connect: tagSlugs.map((slug: any) => ({ slug })),
        },
      },
      include: {
        tags: true,
      },
    });
    return NextResponse.json(
      { message: "POST Blog successfully", posts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can not POST Blog", error },
      { status: 500 }
    );
  }
}
