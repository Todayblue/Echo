import BlogCarousel from "@/components/BlogCarousel";
import { CommuCard } from "@/components/CommuCard";
import CommunityPostCard from "@/components/CommunityPostCard";
import RecentBlogPosts from "@/components/blog/RecentBlogPosts";
import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const communities = await prisma.community.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      profileImage: true,
    },
  });

  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      title: true,
      coverImage: true,
    },
  });

  return (
    <div className="bg-white pt-2">
      <div className="grid mx-auto w-4/5 gap-6 py-6">
        <div className=" ">
          <RecentBlogPosts />
        </div>

        <ScrollArea className="w-full h-auto rounded-md border bg-white ">
          <div className="border-b bg-secondary  px-6 py-3">
            <p className="tracking-wide text-base  font-semibold">
              Choose Community
            </p>
          </div>
          <div className="grid grid-cols-10 place-items-center mx-2 p-2 ">
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
      </div>

      <div className="grid mx-auto w-4/5 grid-cols-6 gap-x-6 pb-6">
        <div className="col-span-4 space-y-4">
          <div>
            {communityPosts.map(
              (community) =>
                community.posts.length > 0 && (
                  <div key={community.id} className="mb-4 ">
                    <CommunityPostCard
                      communitySlug={community.slug}
                      communityName={community.name}
                      communityDescription={community.description}
                      communityImage={community.profileImage}
                      posts={community.posts}
                    />
                  </div>
                )
            )}
          </div>
        </div>

        {/* subreddit info */}
        <div className="col-span-2 flex flex-col space-y-4 ">
          <div className="w-screen  md:w-full  h-fit rounded-lg border border-gray-300 order-first md:order-last">
            <div className="bg-secondary rounded-t-md px-6 py-4 ">
              <p className="font-semibold py-3 flex items-center gap-1.5  ">
                <HomeIcon className="h-4 w-4 " />
                Home
              </p>
            </div>
            <div className="-my-3 divide-y divide-gray-100 grid px-6 py-4 text-sm leading-6 gap-y-2">
              <p className="text-zinc-500 pt-2">
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
              <div className="grid gap-y-2 pt-3 pb-2 ">
                <Link href={`/community/create`}>
                  <Button variant={"outline"} className=" w-full">
                    Create Community
                  </Button>
                </Link>
                <Link href={`/post/create`}>
                  <Button variant={"outline"} className="w-full">
                    Create Post
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-screen  md:w-full bg-white h-fit  border-gray-300 order-first md:order-last">
            {/* <BlogCarousel blogs={blogs} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
