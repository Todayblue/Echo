import AboutCommunity from "@/components/community/comment/AboutCommunity";
import CommentPost from "@/components/community/comment/CommentPost";
import RuleList from "@/components/community/rule/RuleList";
import {Button, buttonVariants} from "@/components/ui/button";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {ArrowBigDown, ArrowBigUp, Dot, Loader2} from "lucide-react";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import {PostVoteServer} from "@/components/community/vote/PostVoteServer";
import {formatTimeToNow} from "@/lib/utils";
import CommentsSection from "@/components/community/comment/CommentPost";
import Image from "next/image";
import GoogleMap from "@/components/GoogleMap";
import {Card} from "@/components/ui/card";
import Video from "@/components/Video";
import Link from "next/link";
import {ScrollArea} from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Page = async ({params: {id}}: {params: {id: string}}) => {
  const session = await getAuthSession();

  const post = await prisma.post.findFirst({
    where: {
      id: id,
    },
    include: {
      votes: true,
      author: true,
      comments: true,
    },
  });

  const community = await prisma.community.findFirst({
    where: {
      id: post?.communityId,
      isActive: true,
    },
    include: {
      rule: true,
      _count: {
        select: {
          subscribers: true,
        },
      },
    },
  });

  const cleanContent = post?.content?.replace(
    /<br\s?\/?>|<u\s?\/?>|<strong\s?\/?>|<em\s?\/?>/g,
    ""
  );

  if (!community || !post) {
    return notFound;
  }

  return (
    <ScrollArea className="h-full pt-6 px-52">
      <div className="grid place-content-center lg:grid-cols-6 gap-6 md:grid-cols-1 pb-4">
        <div className="col-span-4 space-y-4">
          <Card className="flex flex-row space-x-3 p-2 ">
            <div className=" w-full">
              <div className="border border-gray-300  bg-white  p-4 flex leading-normal rounded-lg">
                <Suspense fallback={<PostVoteShell />}>
                  <PostVoteServer
                    postId={post?.id}
                    getData={async () => {
                      return await prisma.post.findUnique({
                        where: {
                          id: id,
                        },
                        include: {
                          votes: true,
                        },
                      });
                    }}
                  />
                </Suspense>
                <div className="mb-4 pt-3">
                  <div className="flex  justify-between pb-2">
                    <div className="flex flex-row justify-center items-center">
                      <Link
                        href={`/community/${community.slug}`}
                        className="flex flex-row hover:text-blue-900 justify-center items-center"
                      >
                        <img
                          className="w-6 h-6 rounded-full"
                          src={community.profileImage || ""}
                          alt={community.name || ""}
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium">
                            {community.name}
                          </p>
                        </div>
                      </Link>
                      <Dot size={16} className="text-gray-400" />
                      <div className="text-sm text-gray-400 flex  gap-x-2">
                        <h3 className="">Posted by : {post?.author.name}</h3>
                        <p>{formatTimeToNow(new Date(post?.createdAt))}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <div className="text-gray-900 font-bold text-xl">
                      {post?.title}
                    </div>
                    <div className="relative text-sm h-auto w-full pt-1 ">
                      {cleanContent ? (
                        <div
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{__html: cleanContent}}
                        />
                      ) : null}
                      {/* h-40 = 160px */}
                    </div>
                  </div>
                  {post.imageUrl && (
                    <figure className="flex justify-center pt-4">
                      <Image
                        src={post.imageUrl}
                        alt={`picture of ${post.author.name}`}
                        width={500}
                        height={500}
                        className="m-h-[512px]"
                        priority={true}
                      />
                    </figure>
                  )}
                  {post.videoUrl && (
                    <Video
                      src={post.videoUrl}
                      className="m-h-[512px] rounded-sm w-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
          {post.latitude && post.longitude ? (
            <Card>
              <div className="w-full h-60 p-2">
                <GoogleMap lat={post.latitude} lng={post.longitude} />
              </div>
            </Card>
          ) : null}
          {/* Comment */}
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error Server Component */}
            <CommentsSection postId={post.id} />
          </Suspense>
        </div>
        {/* info sidebar */}
        <div className="col-span-2 flex flex-col space-y-4">
          <AboutCommunity
            community={community}
            memberCount={community._count.subscribers}
          />
          {community.rule.length > 0 && (
            <RuleList rules={community.rule} community={community} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}

      <Button variant="ghost">
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </Button>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}

      <Button variant="ghost">
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </Button>
    </div>
  );
}

export default Page;
