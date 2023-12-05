// import CommentsSection from "@/components/CommentsSection";
// import EditorOutput from "@/components/EditorOutput";
// import PostVoteServer from "@/components/post-vote/PostVoteServer";
// import { buttonVariants } from "@/components/ui/Button";
// import { db } from "@/lib/db";
// import { redis } from "@/lib/redis";
// import { formatTimeToNow } from "@/lib/utils";
// import { CachedPost } from "@/types/redis";
import AboutCommunity from "@/components/community/comment/AboutCommunity";
import CommentPost from "@/components/community/comment/CommentPost";
import RuleList from "@/components/community/rule/RuleList";
import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArrowBigDown, ArrowBigUp, Dot, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getAuthSession();

  const post = await prisma.post.findFirst({
    where: {
      id: id,
    },
    include: {
      votes: true,
      author: true,
    },
  });

  const community = await prisma.community.findFirst({
    where: { id: post?.communityId },
  });

  const memberCount = await prisma.subscription.count({
    where: {
      community: {
        id: post?.communityId,
      },
    },
  });

  const rules = await prisma.rule.findMany({
    where: {
      communityId: post?.communityId,
    },
    orderBy: {
      id: "asc",
    },
  });

  const cleanContent = post?.content?.replace(
    /<br\s?\/?>|<u\s?\/?>|<strong\s?\/?>|<em\s?\/?>/g,
    ""
  );

  if (!community || !post) return <div>loading state</div>;

  return (
    <div className="grid  min-h-screen  bg-gray-300 ">
      <div className="py-12 mx-24 ">
        <div className="grid place-content-center lg:grid-cols-6  gap-6 md:grid-cols-1 ">
          {/* <ToFeedButton /> */}
          <div className="col-span-4 space-y-4">
            <div className="flex flex-row space-x-3 p-2 w-full border border-gray-300 rounded-md bg-white">
              <div className=" w-full">
                <div className="border border-gray-300  bg-white  p-4 flex leading-normal rounded-lg">
                  {/* <PostVoteClient
                    postId={id}
                    initialVotesAmt={votesAmt}
                    initialVote={currentVote?.type}
                  /> */}
                  <div className="mb-4">
                    <div className="flex items-center">
                      <h1 className="hover:underline"></h1>
                      <Dot size={20} className="text-gray-500" />
                      <div className="text-sm text-gray-400 flex items-center gap-x-2">
                        <h3 className="">Posted by : {post?.author.name}</h3>
                        {/* <p>{formatTimeToNow(new Date(post?.createdAt))}</p> */}
                      </div>
                    </div>

                    <div className="text-gray-900 font-bold text-xl">
                      {post?.title}
                    </div>

                    <div className="relative text-sm h-auto w-full  ">
                      {cleanContent ? (
                        <div
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: cleanContent }}
                        />
                      ) : null}
                      {/* h-40 = 160px */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Comment */}
            <CommentPost />
          </div>
          {/* info sidebar */}
          <div className="col-span-2 flex flex-col space-y-4">
            <AboutCommunity
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
};

export default Page;
