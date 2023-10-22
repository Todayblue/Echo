import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        Post: true,
        subscriptions: true,
        createdSubCommunity: true,
        votes: true,
      },
    });
    return NextResponse.json(
      { message: "GET User successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't GET User", error },
      { status: 500 }
    );
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { title, content, coverImage, authorId, categoryId } =
//       await request.json();
//     const blogId = params.id;
//     console.log("blogId", blogId);

//     const updateBlog = await prisma.blog.update({
//       where: {
//         id: blogId,
//       },
//       data: {
//         title,
//         content,
//         coverImage,
//         authorId,
//       },
//     });
//     return NextResponse.json(
//       { message: "UPDATE Blog successfully", updateBlog },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Can't UPDATE Blogs", error },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(
      { message: "DELETE User Successfully", deleteUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't DELETE User", error },
      { status: 500 }
    );
  }
}
