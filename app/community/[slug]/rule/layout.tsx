import AboutCommunity from "@/components/community/comment/AboutCommunity";
import RuleList from "@/components/community/rule/RuleList";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getAuthSession();

  const community = await prisma.community.findFirst({
    where: { slug: slug },
    include: {
      rule: true,
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  if (!community) return notFound();

  const rules = await prisma.rule.findMany({
    where: {
      communityId: community.id,
    },
    orderBy: {
      id: "asc",
    },
  });

  const memberCount = await prisma.subscription.count({
    where: {
      community: {
        slug: slug,
      },
    },
  });

  return (
    <div className="grid  min-h-screen  bg-gray-300 ">
      <div className="py-16 mx-24 ">
        <div className="grid place-content-center lg:grid-cols-6  gap-6 md:grid-cols-1 ">
          {/* <ToFeedButton /> */}
          <div className="col-span-4">{children}</div>
          {/* info sidebar */}
          <div className="col-span-2 flex flex-col space-y-4">
            <AboutCommunity
              title={community.title}
              description={community.description}
              session={session}
              memberCount={memberCount}
              slug={community.slug}
              createdAt={community.createdAt}
              creatorId={community.creatorId}
            />
            <RuleList
              session={session}
              communityCreatorId={community.creatorId}
              communitySlug={community.slug}
              communityName={community.name}
              rules={rules}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
