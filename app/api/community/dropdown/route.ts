import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {DropdownOption} from "@/types/common";
import {NextResponse} from "next/server";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {status: 401});
  }

  try {
    const communities = await prisma.community.findMany({
      where: {
        isActive: true,
        subscribers: {
          some: {
            userId: session?.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const dropdownOptions: DropdownOption[] = communities.map((community) => ({
      value: community.id,
      label: community.name,
    }));

    return NextResponse.json(dropdownOptions);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not get community", error},
      {status: 500}
    );
  }
}
