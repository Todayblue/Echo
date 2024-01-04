import prisma from "@/lib/prisma";
import { UpdateRuleValidator } from "@/lib/validators/rule";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
      const { id } = params;
    const body = await request.json();

    const { title, description } = UpdateRuleValidator.parse(body);

    const updatedRule = await prisma.rule.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    return NextResponse.json(error);
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const deletedRules = await prisma.rule.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(deletedRules);
  } catch (error) {
    return NextResponse.json(error);
  }
}
