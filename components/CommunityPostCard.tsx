import React, { FC } from "react";
import CommunityAvatar from "./community/CommunityAvatar";
import { Users } from "lucide-react";
import prisma from "@/lib/prisma";
import CommunityPost from "./homepage/CommunityPost";
import { Post, User } from "@prisma/client";
import Link from "next/link";

type CommunityPostCardProps = {
  communityName: string;
  communityDescription: string | null;
  communitySlug: string | null;
  communityImage: string | null;
  posts?: ExtendedPost[];
};

type ExtendedPost = Post & {
  author: User;
};

const CommunityPostCard: FC<CommunityPostCardProps> = async ({
  communityName,
  communitySlug,
  communityDescription,
  communityImage,
  posts,
}) => {
  // const memberCount = await prisma.subscription.count({
  //   where: {
  //     community: {
  //       slug: communitySlug,
  //     },
  //   },
  // });

  return (
    <div className="rounded-md border ">
      <div className="px-6 py-4  mx-auto flex items-center space-x-4 border-b">
        <Link className="shrink-0" href={`/community/${communitySlug}`}>
          <CommunityAvatar
            communityName={communityName}
            profileImage={communityImage || ""}
            className="w-12 h-12"
          />
        </Link>
        <div className="w-full">
          <Link href={`/community/${communitySlug}`}>
            <h1 className="text-xl font-semibold hover:underline">
              {communityName}
            </h1>
          </Link>
          {/* <div className="flex flex-row space-x-2 text-gray-500">
              <p className="text-xl font-medium">{memberCount}</p>
              <Users className="w-auto h-auto" />
            </div> */}
          <p className="text-sm text-muted-foreground">
            {communityDescription}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y ">
        {posts?.map((post) => (
          <CommunityPost
            key={communitySlug}
            post={post}
            communitySlug={communitySlug}
          />
        ))}
      </div>
      <Link
        className="h-[40px] rounded-b-md grid grid-cols-1 bg-gray-300 hover:bg-gray-200 items-center"
        href={`/community/${communitySlug}`}
      >
        <p className="text-center font-medium">see more</p>
      </Link>
    </div>
  );
};

export default CommunityPostCard;
