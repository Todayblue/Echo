import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const community = await prisma.subCommunity.findFirst({
      where: {
        slug: params.slug,
      },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
          },
        },
        rule: true,
        subscribers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    return NextResponse.json(
      { message: "GET Community successfully", community },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't GET Community", error },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { title, content, coverImage, authorId, tags }: Blog =
//       await request.json();

//     const slugify = require("slugify");
//     const blogSlug: string = slugify(title).toLowerCase();

//     const updateBlog = await prisma.blog.update({
//       where: {
//         slug: params.slug,
//       },
//       data: {
//         title,
//         slug: blogSlug,
//         content,
//         coverImage,
//         authorId,
//         tags: {
//           connect: tags.map((tag) => ({ id: tag.id })),
//         },
//       },
//     });
//     return NextResponse.json(
//       { message: "UPDATE Blog successfully", updateBlog },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Can't UPDATE Blog", error },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const blogSlug = params.slug;
//   try {
//     const deleteBlog = await prisma.blog.delete({
//       where: {
//         slug: blogSlug,
//       },
//     });
//     return NextResponse.json(
//       { message: "DELETE Blog Successfully", deleteBlog },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Can't DELETE Blog", error },
//       { status: 500 }
//     );
//   }
// }
