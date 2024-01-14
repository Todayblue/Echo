import ChooseCommunity from "@/components/ChooseCommunity";
import CommunityPostCard from "@/components/CommunityPostCard";
import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Home as HomeIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();

  const communityPosts = await prisma.community.findMany({
    include: {
      posts: {
        take: 10,
        include: {
          comments: true,
          author: true,
        },
      },
    },
  });

  return (
    <div className="grid mx-auto w-4/5 grid-cols-6 gap-x-6 py-6">
      <div className="col-span-4 space-y-4">
        {/* border border-gray-300 bg-white p-4 flex leading-normal rounded-lg */}
        <div>
          <ChooseCommunity />
        </div>
        <div className="">
          {communityPosts.map((community) => (
            <div key={community.id} className="mb-4">
              {/* Add margin-bottom */}
              <CommunityPostCard
                communitySlug={community.slug}
                communityName={community.name}
                communityDescription={community.description}
                communityImage={community.profileImage}
                posts={community.posts}
              />
            </div>
          ))}
        </div>
      </div>

      {/* subreddit info */}
      <div className="col-span-2 space-y-4 overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last ">
        <div className="bg-emerald-100 px-6 py-4">
          <p className="font-semibold py-3 flex items-center gap-1.5">
            <HomeIcon className="h-4 w-4" />
            Home
          </p>
        </div>
        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <p className="-mt-6 text-zinc-500">
              Your personal Breadit frontpage. Come here to check in with your
              favorite communities.
            </p>
          </div>

          <Link href={`/community/create`}>
            <Button>Create Community</Button>
          </Link>
        </dl>
      </div>
    </div>
  );
}
