import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const popularCommunities = await prisma.community.findMany({
      where: {
        isActive: true,
      },
      include: {
        subscribers: true,
      },
      take: 10,
      orderBy: {
        subscribers: {
          _count: "desc",
        },
      },
    });

    return NextResponse.json(popularCommunities);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not get popularCommunities", error},
      {status: 500}
    );
  }
}
