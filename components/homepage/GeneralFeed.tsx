import prisma from "@/lib/prisma";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/config";
import PostsFeed from "../PostsFeed";

const GeneralFeed = async () => {
  // Fetch community posts with additional information
  const communityPosts = await prisma.community.findMany({
    include: {
      posts: {
        include: {
          votes: true,
          author: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  return (
    <div className="grid grid-cols-2">
      {/* Render community posts with additional information */}
      {communityPosts.map((community) => (
        <div key={community.id}>
          <h2>{community.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default GeneralFeed;
