import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import {VoteType} from "@prisma/client";
import PostsFeed from "@/components/user/UserPosts";

const page = async () => {
  const session = await getAuthSession();
  if (!session) return notFound();

  const voteUp = VoteType.UP;

  const posts = await prisma.post.findMany({
    where: {
      votes: {
        some: {
          type: voteUp,
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

  return (
    <PostsFeed
      initPosts={posts}
      fetchPostsUrl={`/api/user/posts/votes?voteType=${voteUp}&`}
    />
  );
};

export default page;
