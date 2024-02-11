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
  return (
    <div className="rounded-md border ">
      <div className="bg-secondary px-6 py-4 rounded-t-md  mx-auto flex items-center space-x-4 border-b">
        <Link className="shrink-0" href={`/community/${communitySlug}`}>
          <CommunityAvatar
            communityName={communityName}
            profileImage={communityImage || ""}
            className="w-12 h-12"
          />
        </Link>
        <div className="w-full">
          <Link href={`/community/${communitySlug}`}>
            <h1 className="text-xl font-semibold hover:underline ">
              {communityName}
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground text-gray-300">
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
      {/* <Link
        className="h-[40px] rounded-b-md grid grid-cols-1  hover:underline items-center"
        href={`/community/${communitySlug}`}
      >
        <p className="text-center text-base text-gray-700 font-semibold">
          more
        </p>
      </Link> */}
    </div>
  );
};

export default CommunityPostCard;
