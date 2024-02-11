import CustomFeed from "@/components/homepage/CustomFeed";
import CommunityPostCard from "@/components/CommunityPostCard";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommuCard } from "@/components/CommuCard";

type Props = {};

const page = async (props: Props) => {
  const session = await getAuthSession();

  const followerCommunity = await prisma.user.findFirstOrThrow({
    where: {
      id: session?.user.id,
    },
    include: {
      subscriptions: {
        include: {
          community: true,
        },
      },
    },
  });

  return (
    <div className="bg-white pt-3">
      <div className="grid mx-auto w-4/5 grid-cols-6 gap-x-6 py-6">
        <div className="col-span-4 space-y-4 ">
          <ScrollArea className="w-full h-auto rounded-md border bg-white">
            <div className="border-b bg-secondary px-6 py-3">
              <p className="tracking-wide text-base text-gray-700 font-semibold capitalize">
                your follower community
              </p>
            </div>
            <div className="grid grid-cols-10 place-items-center mx-2 p-2 gap-x-2  ">
              {followerCommunity.subscriptions.map((sub) => (
                <CommuCard
                  key={sub.community.id}
                  name={sub.community.name}
                  communitySlug={sub.community.slug}
                  profileImage={sub.community.profileImage}
                  aspectRatio="square"
                  width={60}
                  height={60}
                />
              ))}
            </div>
          </ScrollArea>
          <CustomFeed />
        </div>
        <div className="col-span-2 flex flex-col space-y-4 ">
          <div className="w-screen  md:w-full bg-white h-fit rounded-lg border border-gray-300 order-first md:order-last">
            <div className="bg-secondary rounded-t-md px-6 py-4 ">
              <Link href={"/"}>
                <p className="font-semibold py-3 flex items-center gap-1.5 w-1/4">
                  <HomeIcon className="h-4 w-4" />
                  Home
                </p>
              </Link>
            </div>
            <div className="-my-3 divide-y divide-gray-100 grid px-6 py-4 text-sm leading-6 gap-y-2">
              <p className="text-zinc-500 pt-2">
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
              <div className="grid gap-y-2 pt-3 pb-2 ">
                <Link href={`/community/create`}>
                  <Button className=" w-full">Create Community</Button>
                </Link>
                <Link href={`/post/create`}>
                  <Button className="w-full">Create Post</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
