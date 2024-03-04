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
      },
    },
  });

  return (
    // <div>
    //   {/* Render community posts with additional information */}
    //   {communityPosts.map((community) => (
    //     <div
    //       key={community.id}
    //       className="grid border border-gray-300 rounded-lg my-4"
    //     >
    //       <h2 className="mx-4">{community.name}</h2>
    //       <p className="mx-4 truncate">{community.description}</p>
    //     </div>
    //   ))}
    // </div>
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="bg-indigo-500 text-white py-2 px-4 rounded-t-lg">
        <h2 className="text-lg font-bold">Community Name</h2>
        <p className="text-sm">Community Description</p>
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

export default GeneralFeed;
