import PostsFeed from "@/components/PostsFeed";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import CommuAvatar from "@/components/community/CommuAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LIMIT_POST } from "@/lib/constants";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

import RuleList from "@/components/community/rule/RuleList";
import AboutCommunity from "@/components/community/comment/AboutCommunity";

type communityOption = {
  page?: number;
  limit?: number;
};

const getcommunity = async (slug: string, option: communityOption = {}) => {
  const { page = 1, limit = LIMIT_POST } = option;

  const community = await prisma.community.findFirst({
    where: { slug },
    include: {
      rule: true,
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      },
    },
  });

  return community;
};

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const session = await getAuthSession();
  const community = await getcommunity(slug);

  const subscription = !session?.user
    ? undefined
    : await prisma.subscription.findFirst({
        where: {
          community: {
            slug: slug,
          },
          user: {
            id: session.user?.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!community) return notFound();

  const rules = await prisma.rule.findMany({
    where: {
      communityId: community.id,
    },
    orderBy: {
      id: "asc",
    },
  });

  const memberCount = await prisma.subscription.count({
    where: {
      community: {
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
      <div className="relative w-full h-24 py-3 bg-white border border-b-gray-200">
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
                {community.creatorId !== session?.user?.id ? (
                  <SubscribeLeaveToggle
                    isSubscribed={isSubscribed}
                    communityId={community.id}
                    communityName={community.name}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="grid  min-h-screen  bg-gray-200">
        <div className="grid  mx-auto w-4/5 grid-cols-6 gap-x-6   py-6">
          {/* <ToFeedButton /> */}

          <div className="col-span-4 space-y-4">
            <div className="flex flex-row space-x-3 p-2 w-full border border-gray-300 rounded-md bg-white">
              <Avatar className="flex flex-none">
                <AvatarImage src={session?.user.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Link className="w-full" href={`/community/${slug}/post/create`}>
                <Input placeholder="Create Post..." />
              </Link>
            </div>
            <PostsFeed initPosts={community.posts} communityName={slug} />
          </div>

          {/* info sidebar */}
          <div className="col-span-2  space-y-4">
            <AboutCommunity
              session={session}
              memberCount={memberCount}
              slug={community.slug}
              createdAt={community.createdAt}
              creatorId={community.creatorId}
            />
            <RuleList
              session={session}
              communityCreatorId={community.creatorId}
              communitySlug={community.slug}
              communityName={community.name}
              rules={rules}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
