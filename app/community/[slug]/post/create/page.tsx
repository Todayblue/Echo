import { CardHeader, CardTitle } from "@/components/ui/card";
import CreateCommunityPost from "@/components/community/post/CreateCommunityPost";
import prisma from "@/lib/prisma";

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const community = await prisma.community.findFirst({
    where: {
      slug: slug,
    },
  });

  const communities = await prisma.community.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!community || !communities) return <div>loading state</div>;

  return (
    <div className=" bg-white rounded-lg">
      <CardHeader className="font-semibold mx-4 border-b border-gray-300">
        <CardTitle>Create Post</CardTitle>
      </CardHeader>

      <CreateCommunityPost communities={communities} community={community} />
    </div>
  );
};

export default Page;
