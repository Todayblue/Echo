import {getAuthSession} from "@/lib/auth";
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
    const blogSlug = params.slug;
    const blog = await prisma.blog.findFirst({
      where: {
        slug: blogSlug,
      },
      include: {
        tags: true,
        author: true,
      },
    });
    return NextResponse.json(
      {message: "GET Blog successfully", blog},
      {status: 200}
    );
  } catch (error) {
    return NextResponse.json({message: "Can't GET Blog", error}, {status: 500});
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
