import { Role } from "@prisma/client";
import type { DefaultUser } from "next-auth";
import "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role?: Role;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    // Omit<Type, Keys> -> picking all properties from Type and then removing Keys
    user: {
      id: UserId;
      role: Role;
    } & DefaultSession["user"];
  }
}
