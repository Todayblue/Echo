import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { RuleCreationRequest, RuleValidator } from "@/lib/validators/rule";
// import { CommunityType } from "@/lib/validators/community";
import { useEffect } from "react";
import { CreateRule } from "@/components/community/rule/CreateRule";
import prisma from "@/lib/prisma";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const community = await prisma.community.findFirst({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
    },
  });

  if (!community) return <div>loading state</div>;

  return <CreateRule community={community} />;
}
