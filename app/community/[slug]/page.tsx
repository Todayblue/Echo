import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommuAvatar from "@/components/community/CommuAvatar";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import CommuCard from "@/components/community/CommuCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

type Card = {
  author: string;
  title: string;
  img?: string;
};

const testCardData: Card[] = [
  {
    author: "Panda",
    title: "Can coffee make you a better developer?",
    img: "https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    author: "Monocerius",
    title: "Can coffee make you a better developer?",
    img: "https://images.unsplash.com/photo-1697615787046-9ea01c331f29?auto=format&fit=crop&q=80&w=1895&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const session = await getAuthSession();
  const subcommunity = await prisma.subCommunity.findFirst({
    where: { slug: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await prisma.subscription.findFirst({
        where: {
          subCommunity: {
            slug: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subcommunity) return notFound();

  const memberCount = await prisma.subscription.count({
    where: {
      subCommunity: {
        slug: slug,
      },
    },
  });

  return (
    <>
      {/* bg */}
      <div className="min-w-full pt-4">
        <div className="bg-sky-500 h-20"></div>
      </div>
      <div className="relative w-full  h-24 py-3 bg-white border border-b-gray-200">
        <div className="mx-32">
          <div className="absolute -top-2 ">
            <CommuAvatar />
          </div>
          {/* text */}
          <div className="pl-24">
            <div className="flex gap-2 ">
              <div>
                <h1 className="text-xl md:text-3xl tracking-wider capitalize font-black">
                  {slug}
                </h1>
                <p className="flex items-center space-x-1 mt-1 text-gray-500">
                  {slug}
                </p>
              </div>
              <div className="px-4">
                {/* <Button className="bg-blue-500 rounded-2xl px-10 hover:bg-blue-300"> */}
                {subcommunity.creatorId !== session?.user?.id ? (
                  <SubscribeLeaveToggle
                    isSubscribed={isSubscribed}
                    subCommunityId={subcommunity.id}
                    subcommunityName={subcommunity.name}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="grid h-full place-items-center bg-gray-300">
        <div className="grid w-4/5 grid-cols-1 gap-x-6   md:grid-cols-3 py-6">
          {/* <ToFeedButton /> */}

          {/* <div className="flex flex-col col-span-2 ">{children}</div> */}
          <div className="flex flex-col col-span-2 space-y-4">
            <div className="flex flex-row space-x-3 p-2 w-full border border-gray-300 rounded-md bg-white">
              <Avatar className="flex flex-none">
                <AvatarImage src={session?.user.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Input placeholder="Create Post..." />
            </div>

            {testCardData.map((item, index) => {
              return (
                <CommuCard
                  key={index}
                  author={item.author}
                  title={item.title}
                  image={item.img}
                />
              );
            })}
          </div>

          {/* info sidebar */}
          <div className="overflow-hidden  bg-white h-fit rounded-lg border border-gray-300 order-first md:order-last">
            <div className="mx-6 pt-4 ">
              <p className="font-semibold py-3 border-b border-gray-300 ">
                About Community
              </p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subcommunity?.createdAt?.toDateString()}>
                    {subcommunity?.createdAt
                      ? format(subcommunity.createdAt, "MMMM d, yyyy")
                      : "N/A"}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subcommunity.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              ) : null}
              <Link href={`/community/${slug}/create-post`}>
                <Button className="w-full">Create Post</Button>
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
