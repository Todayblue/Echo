import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Input} from "@/components/ui/input";
import {LIMIT_POST} from "@/lib/constants";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ScrollArea} from "@/components/ui/scroll-area";

import RuleList from "@/components/community/rule/RuleList";
import AboutCommunity from "@/components/community/comment/AboutCommunity";
import CommunityAvatar from "@/components/community/CommunityAvatar";
const PostsFeed = dynamic(() => import("@/components/PostsFeed"), {
  ssr: false,
});
// import PostsFeed from "@/components/PostsFeed";
import dynamic from "next/dynamic";
import {Role} from "@prisma/client";

type communityOption = {
  page?: number;
  limit?: number;
};

const getcommunity = async (slug: string, option: communityOption = {}) => {
  const {page = 1, limit = LIMIT_POST} = option;

  const community = await prisma.community.findFirst({
    where: {
      slug: slug,
      isActive: true,
    },
    include: {
      rule: true,
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {createdAt: "desc"},
        take: limit,
      },
    },
  });

  return community;
};

const Page = async ({params: {slug}}: {params: {slug: string}}) => {
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
    <ScrollArea className="h-full px-52 pt-6">
      <div className="">
        <div className="bg-sky-500 h-20"></div>
      </div>
      <div className="relative w-full h-24 py-3 bg-white border border-b-gray-200">
        <div className="mx-6">
          <div className="absolute -top-2 ">
            <CommunityAvatar
              className="w-24 h-24"
              communityName={community.name}
              profileImage={community.profileImage || ""}
            />
          </div>
          <div className="flex items-center pl-28 space-x-4">
            <h1 className="text-xl md:text-3xl tracking-wider capitalize font-black ">
              {community.name}
            </h1>

            <div>
              {community.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  communityId={community.id}
                  communityName={community.name}
                />
              ) : null}
            </div>
          </div>
          {/* text */}
        </div>
      </div>
      <div className="grid mx-auto grid-cols-6 gap-x-6 py-6 w-full">
        <div className="col-span-4 space-y-4">
          <PostsFeed initPosts={community.posts} communitySlug={slug} />
        </div>

        <div className="col-span-2 space-y-4 ">
          <div className="sticky top-0">
            <div className="overflow-y-auto max-h-screen">
              <div className="grid gap-4 ">
                <AboutCommunity
                  community={community}
                  memberCount={memberCount}
                />
                {community?.creatorId === session?.user?.id ||
                session?.user.role === Role.ADMIN ? (
                  <RuleList community={community} rules={rules} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Page;
