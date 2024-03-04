import prisma from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/user/sign-in",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials?.password,
          existingUser.password || ""
        );
        if (!passwordMatch) {
          return null;
        }

        // Generate avatar image URL
        const avatarUrl = `https://www.gravatar.com/avatar/${Math.random().toString(36).substring(7)}?d=identicon&r=PG`;

        // Update user profile with the generated avatar URL
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { image: avatarUrl },
        });

        return {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          image: updatedUser.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        const username = `${dbUser.email?.split("@")[0]}_${Math.random().toString(36).substring(7)}`;
        await prisma.user.update({
          data: {
            username: username,
          },
          where: {
            id: dbUser.id,
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
