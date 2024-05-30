import CommunityPostForm from "@/components/community/post/CommunityPostForm";
import {ScrollArea} from "@/components/ui/scroll-area";
import prisma from "@/lib/prisma";
import React from "react";

const Page = async ({params: {slug}}: {params: {slug: string}}) => {
  const communityDDL = await prisma.community.findFirstOrThrow({
    where: {
      slug: slug,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <ScrollArea className="h-full px-52 pt-6">
      <CommunityPostForm
        defaultCommunityDDL={{
          value: communityDDL.id,
          label: communityDDL.name,
        }}
      />
    </ScrollArea>
  );
};

export default Page;
