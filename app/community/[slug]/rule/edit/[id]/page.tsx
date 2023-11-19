import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { RuleCreationRequest, RuleValidator } from "@/lib/validators/rule";
// import { CommunityType } from "@/lib/validators/community";
import { useEffect } from "react";
import { CreateRule } from "@/components/community/rule/CreateRule";
import prisma from "@/lib/prisma";
import { UpdateRule } from "@/components/community/rule/EditeRule";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const community = await prisma.community.findFirst({
    where: {
      rule: {
        some: {
          id: id,
        },
      },
    },
  });

  const rule = await prisma.rule.findFirst({
    where: {
      id: id,
    },
  });

  if (!community || !rule) return <div>loading state</div>;

  return <UpdateRule community={community} rule={rule} />;
}
