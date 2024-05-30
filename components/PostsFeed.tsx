"use client";

import {LIMIT_POST} from "@/lib/constants";
import {useIntersection} from "@mantine/hooks";
import {Comment, Post, Community, User, Vote} from "@prisma/client";
import {useInfiniteQuery} from "@tanstack/react-query";
import axios from "axios";
import {Frown, Loader2} from "lucide-react";
import {useSession} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import PostCard from "./community/PostCard";
import {useInView} from "react-intersection-observer";
import PostLoading from "./loading/PostLoading";
import {ExtendedPost} from "@/types";
import {getPosts} from "@/services/common";
import SelectFilterTabs from "./SelectFilterTabs";

type PostsFeedProps = {
  initPosts: ExtendedPost[];
  communitySlug?: string;
};

const sortTimeoptions = [
  {value: "all", label: "All Time"},
  {value: "year", label: "Past Year"},
  {value: "month", label: "Past Month"},
  {value: "week", label: "Past Week"},
  {value: "day", label: "Past 24 Hours"},
  {value: "hour", label: "Past Hour"},
];

const sortOptions = [
  {value: "new", label: "Newest"},
  {value: "comments", label: "Most Comments"},
  {value: "votes", label: "Most Votes"},
];

const PostsFeed = ({initPosts, communitySlug}: PostsFeedProps) => {
  const [time, setTime] = useState<string>("all");
  const [sort, setSort] = useState<string>(communitySlug ? "new" : "relevance");
  const {data: session} = useSession();
  const {ref, inView} = useInView();

  const {
    data: queryResults,
    status,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", time, sort],
    queryFn: ({pageParam}) =>
      getPosts(pageParam, communitySlug || "", time || "", sort || ""),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSelectTime = (value: string) => {
    setTime(value);
  };

  const handleSelectSort = (value: string) => {
    setSort(value);
  };

  const posts = queryResults?.pages.flatMap((page: any) => page) ?? initPosts;

  return (
    <>
      <div>
        <SelectFilterTabs
          handleSelectTime={handleSelectTime}
          handleSelectSort={handleSelectSort}
          sortTimeoptions={sortTimeoptions}
          sortOptions={sortOptions}
        />
      </div>
      {posts.length > 0 ? (
        <ul className="flex flex-col gap-y-2">
          {posts.map((post: ExtendedPost, idx: number) => {
            const votesAmt = post.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const currentVote = post.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <li key={post.id} ref={ref}>
                {status === "pending" ? (
                  <PostLoading />
                ) : (
                  <PostCard
                    id={post.id}
                    slug={post.community.slug}
                    image={post.imageUrl}
                    commu={post.community.name}
                    author={post.author.name}
                    title={post.title}
                    content={post.content}
                    createdAt={post.createdAt}
                    videoUrl={post.videoUrl}
                    commentsCount={post.comments.length}
                    comunityName={post.community.name}
                    communityImg={post.community.profileImage}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                    lat={post.latitude}
                    lng={post.longitude}
                  />
                )}
              </li>
            );
          })}

          {isFetchingNextPage && (
            <li className="flex justify-center">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </li>
          )}
        </ul>
      ) : (
        <div className="flex justify-center  space-x-2 p-4">
          <div className="shrink-0">
            <Frown />
          </div>
          <div>
            <p className="text-slate-500 text-center">
              No results found for posts.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PostsFeed;
