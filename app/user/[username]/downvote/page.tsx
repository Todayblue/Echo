import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import {VoteType} from "@prisma/client";
import UserPostsFeed from "@/components/user/UserPostsFeed";

const page = async () => {
  const session = await getAuthSession();
  if (!session) return notFound();

  const voteDown = VoteType.DOWN;

  const posts = await prisma.post.findMany({
    where: {
      votes: {
        some: {
          type: voteDown,
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <UserPostsFeed initPosts={posts} searchType={"downvote"} />;
};

export default page;
