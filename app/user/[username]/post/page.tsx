// pages/user/posts.tsx
import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import PostsFeed from "@/components/user/UserPosts";


const page = async () => {
  const session = await getAuthSession();
  if (!session) return notFound();

  const posts = await prisma.post.findMany({
    where: {
      authorId: session.user.id,
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

  return <PostsFeed initPosts={posts} fetchPostsUrl="/api/user/posts?" />;
};

export default page;
