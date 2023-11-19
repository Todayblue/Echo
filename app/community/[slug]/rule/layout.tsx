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
            <div className="w-screen md:w-full bg-white h-fit rounded-lg border border-gray-300 order-first md:order-last">
              <div className="mx-6 pt-4 ">
                <p className="font-semibold py-3 border-b border-gray-300 ">
                  About Community
                </p>
              </div>
              <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-4 ">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">
                    <time dateTime={community?.createdAt?.toDateString()}>
                      {community?.createdAt
                        ? format(community.createdAt, "MMMM d, yyyy")
                        : "N/A"}
                    </time>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Members</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="text-gray-900">{memberCount}</div>
                  </dd>
                </div>
                {community.creatorId === session?.user?.id ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">
                      You created this community
                    </dt>
                  </div>
                ) : null}
                <Link href={`/community/${slug}/create-post`}>
                  <Button className="w-full">Create Post</Button>
                </Link>
              </dl>
            </div>
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
