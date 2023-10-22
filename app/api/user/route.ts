import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {

    const users = await prisma.user.findMany({

    });

    return NextResponse.json(users);
  } catch (error) {

    return NextResponse.json(
      { message: "Could not create subsidairy", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    const user = await prisma.user.create({
      data: {
        name,
      },
    });
    return NextResponse.json(
      { message: "Create User successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't Crate User", error },
      { status: 500 }
    );
  }
}
