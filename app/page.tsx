import {CommuCard} from "@/components/CommuCard";
import prisma from "@/lib/prisma";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getAuthSession} from "@/lib/auth";
import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();

  const communities = await prisma.community.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      profileImage: true,
    },
  });

  const popularCommunities = await prisma.community.findMany({
    where: {
      isActive: true,
    },
    include: {
      subscribers: true,
    },
    take: 10,
    orderBy: {
      subscribers: {
        _count: "desc",
      },
    },
  });

  return (
    <ScrollArea className="h-full pt-6 px-44">
      {communities.length > 0 && (
        <ScrollArea className="w-full rounded-md border bg-white mb-6 h-[284px]">
          <div className="border-b bg-secondary px-6 py-3">
            <p className="tracking-wide text-base font-semibold">Community</p>
          </div>
          <div className="grid grid-cols-8 gap-2 place-items-center mx-2 p-2">
            {communities.map((community) => (
              <CommuCard
                key={community.id}
                name={community.name}
                communitySlug={community.slug}
                profileImage={community.profileImage}
                aspectRatio="square"
                width={60}
                height={60}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="grid grid-cols-6 gap-6">
        <div className="grid col-span-4 gap-y-1">
          {session?.user ? <CustomFeed /> : <GeneralFeed />}
        </div>
        <div className="col-span-2 overflow-hidden">
          {popularCommunities.length > 0 && (
            <ScrollArea className="h-[512px]">
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-md font-semibold">
                    POPULAR COMMUNITIES
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 px-8">
                  {popularCommunities.map((community) => (
                    <Link
                      href={`community/${community.slug}`}
                      className="flex items-center "
                      key={community.id}
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={community.profileImage || ""}
                        alt={community.name}
                      />
                      <div className="ml-2">
                        <p className="text-base  ">{community.name}</p>
                        <p className="text-sm text-gray-600">
                          {community.subscribers.length} members
                        </p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </ScrollArea>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
