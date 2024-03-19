import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { CreateUserValidator, UpdateUserValidator } from "@/lib/validators/user";


export async function GET() {
  try {
    const users = await prisma.user.findMany({
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not get User", error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { email, username, password } = CreateUserValidator.parse(body);


    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      }
    })
    const existingUserByUserName = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUserByEmail) {
      return NextResponse.json({ user: existingUserByEmail, message: 'User with this email already exists' },{status: 409});
    }
    if (existingUserByUserName) {
      return NextResponse.json(
        {
          user: existingUserByUserName,
          message: "User with this username already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const {password: newUserPassword, ...rest}= newUser

    return NextResponse.json(
      { message: "Create User Successfully", user: rest },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Can't Crate User", error },
      { status: 500 }
    );
  }
}