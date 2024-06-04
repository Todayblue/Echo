import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

const rules = [
  {
    id: 1,
    text: "Remember the human",
  },
  {
    id: 2,
    text: "Behave like you would in real life",
  },
  {
    id: 3,
    text: "Look for the original source of content",
  },
  {
    id: 4,
    text: "Search for duplication before posting",
  },
  {
    id: 5,
    text: "Read the community guidlines",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id") || "";

    if (id == "") {
      return NextResponse.json(null);
    }

    const community = await prisma.community.findFirstOrThrow({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        rule: true,
        subscribers: true,
        _count: {
          select: {
            subscribers: true,
          },
        },
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not get community", error},
      {status: 500}
    );
  }
}
