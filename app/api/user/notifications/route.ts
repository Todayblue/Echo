import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const session = await getAuthSession();
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session?.user.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not get User", error},
      {status: 500}
    );
  }
}
