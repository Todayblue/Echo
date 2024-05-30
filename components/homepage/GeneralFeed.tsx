import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import prisma from "@/lib/prisma";
import PostsFeed from "../PostsFeed";

const GeneralFeed = async () => {
  const posts = await prisma.post.findMany({
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

  return <PostsFeed initPosts={posts} />;
};

export default GeneralFeed;
