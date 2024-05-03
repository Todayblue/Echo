"use client";

import {LIMIT_POST} from "@/lib/constants";
import {useIntersection} from "@mantine/hooks";
import {Comment, Post, Community, User, Vote} from "@prisma/client";
import {useInfiniteQuery} from "@tanstack/react-query";
import axios from "axios";
import {Loader2} from "lucide-react";
import {useSession} from "next-auth/react";
import {useEffect, useRef} from "react";
import PostCard from "./community/PostCard";
import {useInView} from "react-intersection-observer";
import PostLoading from "./loading/PostLoading";

type ExtendedPost = Post & {
  community: Community;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

type PostsFeedProps = {
  initPosts: ExtendedPost[];
  communitySlug?: string;
};

const PostsFeed = ({initPosts, communitySlug}: PostsFeedProps) => {
  const {data: session} = useSession();
  const {ref, inView} = useInView();
  const fetchPosts = async ({pageParam = 1}) => {
    const query =
      `/api/posts?limit=${LIMIT_POST}&page=${pageParam}` +
      (!!communitySlug ? `&community=${communitySlug}` : "");

    const {data} = await axios.get(query);

    return data as ExtendedPost[];
  };

  const {data, status, fetchNextPage, isFetchingNextPage, hasNextPage} =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
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

        return (
          <li key={post.id}>
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
                votesAmt={votesAmt}
                currentVote={currentVote}
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
  );
};

export default PostsFeed;
