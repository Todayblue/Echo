"use client";

import { LIMIT_POST } from "@/lib/constants";
import { useIntersection } from "@mantine/hooks";
import { Comment, Post, SubCommunity, User, Vote } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import PostCard from "./community/PostCard";

type ExtendedPost = Post & {
  subCommunity: SubCommunity;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

type PostsFeedProps = {
  initPosts: ExtendedPost[];
  subCommunityName?: string;
};

const PostsFeed = ({ initPosts, subCommunityName }: PostsFeedProps) => {
  const { data: session } = useSession();

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const fetchPosts = async ({ pageParam = 1 }) => {
    const query =
      `/api/posts?limit=${LIMIT_POST}&page=${pageParam}` +
      (!!subCommunityName ? `&subcommunity=${subCommunityName}` : "");

    const { data } = await axios.get(query);

    return data as ExtendedPost[];
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
    initialData: { pages: [initPosts], pageParams: [1] },
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page: any) => page) ?? initPosts;

  return (
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

        if (idx === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <PostCard
                key={post.id}
                id={post.id}
                commu={subCommunityName}
                author={post.author.name}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              commu={subCommunityName}
              author={post.author.name}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
};

export default PostsFeed;
