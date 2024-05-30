import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function PATCH(
  request: Request,
  {params}: {params: {id: string}}
) {
  try {
    const {id} = params;

    await prisma.notification.update({
      where: {
        id: Number(id),
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({message: "Success"}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "Fail", error}, {status: 500});
  }
}
