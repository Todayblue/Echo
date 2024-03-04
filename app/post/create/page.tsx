import { CardHeader, CardTitle } from "@/components/ui/card";
import CreateCommunityPost from "@/components/community/post/CreateCommunityPost";
import prisma from "@/lib/prisma";

const Page = async () => {
  const communities = await prisma.community.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!communities) return <div>loading state</div>;

  return (
    <div className="grid min-h-screen ">
      <div className="grid place-content-center items-center gap-6 p-8">
        <div className="bg-white rounded-md border ">
          <CreateCommunityPost community={null} communities={communities} />
        </div>
      </div>
    </div>
  );
};

export default Page;
