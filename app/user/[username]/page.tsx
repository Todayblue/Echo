import React from "react";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";

import UserPostsFeed from "@/components/user/UserPostsFeed";

const page = async ({params: {username}}: {params: {username: string}}) => {
  const session = await getAuthSession();

  const followerCommuPost = await prisma.post.findMany({
    where: {
      community: {
        subscribers: {
          some: {
            userId: session?.user.id,
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
      <UserPostsFeed initPosts={followerCommuPost} searchType={"community"} />
    </div>
  );
};

export default page;
