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

  if (!community || !community) return <div>loading state</div>;

  return (
    <div className="bg-white rounded-lg">
      <CardHeader className="font-semibold mx-4 border-b border-gray-300">
        <CardTitle>Create Post</CardTitle>
      </CardHeader>

      <CreateCommunityPost community={community} communities={communities} />
    </div>
  );
};

export default Page;
