import UserCard from "@/components/user/UserCard";
import UserTabs from "@/components/user/UserTabs";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {Suspense} from "react";
import {redirect} from "next/navigation";

export default async function Layout({
  children,
  params: {username},
}: {
  children: React.ReactNode;
  params: {username: string};
}) {
  const session = await getAuthSession();

  if (!session) return redirect("/user/sign-in");

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
  });

  const userCommunity = await prisma.community.findMany({
    where: {
      subscribers: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return (
    <div className="grid ">
      <div className="bg-secondary min-h-screen">
        <div className="pt-2 ">
          <UserTabs user={user} />
        </div>
        <div className="grid grid-cols-6 mx-32 gap-x-6 py-4">
          <div className="col-span-4">{children}</div>
            <UserCard user={user} userCommunity={userCommunity} />
        </div>
      </div>
    </div>
  );
}
