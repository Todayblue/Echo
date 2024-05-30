import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {RuleValidator} from "@/lib/validators/rule";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({});

    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json(
      {message: "Could not Rules", error},
      {status: 500}
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getAuthSession();

    const {title, description, communityId} = RuleValidator.parse(body);

    const community = await prisma.community.findFirst({
      where: {
        id: communityId,
      },
    });

    if (session?.user.id !== community?.creatorId) {
      return new Response("Only created this community can create rules!!", {
        status: 401,
      });
    }

    const rule = await prisma.rule.create({
      data: {
        title,
        description,
        communityId,
        authorId: session?.user.id,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    return NextResponse.json(error);
  }
}
