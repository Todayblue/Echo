import React from "react";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import PostsFeed from "@/components/PostsFeed";

import FollowerCommunity from "@/components/FollowerCommunity";
import {Suspense} from "react";
import ImageGrid from "@/components/loading/ImageGrid";

const page = async ({params: {username}}: {params: {username: string}}) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  const communityFollower = await prisma.community.findMany({
    where: {
      subscribers: {
        some: {
          userId: user?.id,
        },
      },
    },
  });

  const followerCommuPost = await prisma.post.findMany({
    where: {
      community: {
        subscribers: {
          some: {
            userId: user?.id,
          },
        },
      },
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return (
    <div className="grid mx-auto  gap-x-6 ">
      <div className="col-span-4 space-y-4 ">
        <FollowerCommunity communityFollower={communityFollower} />
        <PostsFeed initPosts={followerCommuPost} />
      </div>
    </div>
  );
};

export default page;
