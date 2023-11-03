import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RuleValidator } from "@/lib/validators/rule";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({});

    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not Rules", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

      const session = await getAuthSession();

      if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
      }


    const { title, description, subCommunityId } =
      RuleValidator.parse(body);

    const rule = await prisma.rule.create({
      data: {
        title,
        description,
        subCommunityId,
        authorId: session.user.id
      },
    });

    return NextResponse.json(
      { message: "Create Rule successfully", rule },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Could not community rules this time. Please try later",
        error,
      },
      { status: 500 }
    );
  }
}
