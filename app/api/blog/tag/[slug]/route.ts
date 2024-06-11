import {getAuthSession} from "@/lib/auth";
import {calSkip} from "@/lib/calSkip";
import prisma from "@/lib/prisma";
import {generateSlug} from "@/lib/slugtify";
import {BlogPayload, BlogValidator} from "@/lib/validators/blog/blog";
import {Blog, Tag} from "@prisma/client";
import {NextResponse} from "next/server";

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

    return NextResponse.json({message: "Success", blogs}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "Fail", error}, {status: 500});
  }
}

export async function PATCH(
  request: Request,
  {params}: {params: {slug: string}}
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {status: 401});
    }

    const body = await request.json();
    const {title, content, coverImage, tagIds} = BlogValidator.parse(body);

    const existingBlog = await prisma.blog.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        tags: true,
      },
    });

    let currentSlug =
      existingBlog?.title !== title ? generateSlug(title) : params.slug;

    // Determine tags to connect (new tags) and disconnect (removed tags)
    const tagsToConnect = tagIds.filter(
      (tagId) => !existingBlog?.tags.find((tag) => tag.id === tagId)
    );
    const tagsToDisconnect = existingBlog?.tags.filter(
      (tag) => !tagIds.includes(tag.id)
    );

    // Update the blog post with both connect and disconnect operations
    const updateBlog = await prisma.blog.update({
      where: {
        slug: params.slug,
      },
      data: {
        title,
        slug: currentSlug,
        content,
        coverImage,
        tags: {
          connect: tagsToConnect.map((tagId) => ({id: tagId})),
          disconnect: tagsToDisconnect?.map((tag) => ({id: tag.id})),
        },
      },
    });

    return NextResponse.json({message: "Success", updateBlog}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "Fail", error}, {status: 500});
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
