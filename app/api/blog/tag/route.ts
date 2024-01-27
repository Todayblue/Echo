import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slugtify";
import { TagValidator } from "@/lib/validators/blog/tag";
import { CommunityValidator } from "@/lib/validators/community";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
    });

    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not get Tags", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
  try {
    const body = await request.json();
    const { name } = TagValidator.parse(body);
    const slug = generateSlug(name);

    // check if subreddit already exists
    const tagExists = await prisma.tag.findFirst({
      where: {
        slug: slug,
      },
    });

    if (tagExists) {
      return new Response("Tag already exists", { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: {
        name: name,
        authorId: session.user.id,
        slug: slug,
      }
    })

    return NextResponse.json(
      { message: "Create Tag successfully", tag },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't Crate Tag", error },
      { status: 500 }
    );
  }
}
