import {getAuthSession} from "@/lib/auth";
import {notFound} from "next/navigation";
import prisma from "@/lib/prisma";
import {INFINITE_SCROLL_PAGINATION_RESULTS} from "@/lib/config";
import UserPostsFeed from "../user/UserPostsFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const followedCommunities = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      community: {
        name: {
          in: followedCommunities.map((sub) => sub.community.name),
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

  return <UserPostsFeed initPosts={posts} searchType={"community"} />;
};

export default CustomFeed;
