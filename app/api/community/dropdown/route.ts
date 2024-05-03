import prisma from "@/lib/prisma";
import {DropdownOption} from "@/types/common";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const communities = await prisma.community.findMany({
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
