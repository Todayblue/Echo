import CommunityPostForm from "@/components/community/post/CommunityPostForm";
import prisma from "@/lib/prisma";
import React from "react";

const Page = async ({params: {slug}}: {params: {slug: string}}) => {
  const communityDDL = await prisma.community.findFirstOrThrow({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-10">
      <CommunityPostForm
        defaultCommunityDDL={{value: communityDDL.id, label: communityDDL.name}}
      />
    </div>
  );
};

export default Page;
