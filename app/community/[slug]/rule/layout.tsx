import AboutCommunity from "@/components/community/comment/AboutCommunity";
import RuleList from "@/components/community/rule/RuleList";
import {ScrollArea} from "@/components/ui/scroll-area";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";

export default async function Layout({
  children,
  params: {slug},
}: {
  children: React.ReactNode;
  params: {slug: string};
}) {
  const community = await prisma.community.findFirst({
    where: {
      slug: slug,
      isActive: true,
    },
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

  const rules = await prisma.rule.findMany({
    where: {
      communityId: community?.id,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!community) return notFound();

  const memberCount = await prisma.subscription.count({
    where: {
      community: {
        slug: slug,
      },
    },
  });

  return (
    <ScrollArea className="h-full px-52 pt-6">
      <div className="grid place-content-center lg:grid-cols-6  gap-6 md:grid-cols-1 ">
        <div className="col-span-4">{children}</div>
        <div className="col-span-2 space-y-4 ">
          <div className="sticky top-0 ">
            <div className="overflow-y-auto max-h-screen ">
              <div className="grid gap-4 mb-6">
                <AboutCommunity
                  community={community}
                  memberCount={memberCount}
                />
                {rules.length > 0 && (
                  <RuleList community={community} rules={rules} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
