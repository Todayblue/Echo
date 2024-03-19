"use client";

import { LIMIT_POST } from "@/lib/constants";
import { useIntersection } from "@mantine/hooks";
import { Comment, Post, Community, User, Vote } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import PostCard from "./community/PostCard";
import { useInView } from "react-intersection-observer";

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

const PostsFeed = ({ initPosts, communitySlug }: PostsFeedProps) => {
  const {data: session} = useSession();
  const {ref, inView} = useInView();
  const fetchPosts = async ({ pageParam = 1 }) => {
    const query =
      `/api/posts?limit=${LIMIT_POST}&page=${pageParam}` +
      (!!communitySlug ? `&community=${communitySlug}` : "");

    const { data } = await axios.get(query);

    return data as ExtendedPost[];
  };

  const {data, status, error, fetchNextPage, isFetchingNextPage, hasNextPage} =
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

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  const posts = data.pages.flatMap((page: any) => page) ?? initPosts;

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
                slug={post.community.slug}
                image={post.imageUrl}
                commu={post.community.name}
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
              slug={post.community.slug}
              image={post.imageUrl}
              commu={post.community.name}
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
  // const { data: session } = useSession();

  // const lastPostRef = useRef<HTMLElement>(null);
  // const { ref, entry } = useIntersection({
  //   root: lastPostRef.current,
  //   threshold: 1,
  // });

  // const fetchPosts = async ({ pageParam = 1 }) => {
  //   const query =
  //     `/api/posts?limit=${LIMIT_POST}&page=${pageParam}` +
  //     (!!communitySlug ? `&community=${communitySlug}` : "");

  //   const { data } = await axios.get(query);

  //   return data as ExtendedPost[];
  // };

  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
  //   queryKey: ["projects"],
  //   queryFn: fetchPosts,
  //   initialPageParam: 1,
  //   getNextPageParam: (_, pages) => pages.length + 1,
  //   initialData: { pages: [initPosts], pageParams: [1] },
  // });

  // useEffect(() => {
  //   if (entry?.isIntersecting) {
  //     fetchNextPage(); // Load more posts when the last post comes into view
  //   }
  // }, [entry, fetchNextPage]);

  // const posts = data.pages.flatMap((page: any) => page) ?? initPosts;

  // return (
  //   <ul className="flex flex-col gap-y-2">
  //     {posts.map((post: ExtendedPost, idx: number) => {
  //       const votesAmt = post.votes.reduce((acc, vote) => {
  //         if (vote.type === "UP") return acc + 1;
  //         if (vote.type === "DOWN") return acc - 1;
  //         return acc;
  //       }, 0);

  //       const currentVote = post.votes.find(
  //         (vote) => vote.userId === session?.user.id
  //       );

  //       if (idx === posts.length - 1) {
  //         return (
  //           <li key={post.id} ref={ref}>
  //             <PostCard
  //               key={post.id}
  //               id={post.id}
  //               slug={post.community.slug}
  //               image={post.imageUrl}
  //               commu={post.community.name}
  //               author={post.author.name}
  //               title={post.title}
  //               content={post.content}
  //               createdAt={post.createdAt}
  //               votesAmt={votesAmt}
  //               currentVote={currentVote}
  //             />
  //           </li>
  //         );
  //       } else {
  //         return (
  //           <PostCard
  //             key={post.id}
  //             id={post.id}
  //             slug={post.community.slug}
  //             image={post.imageUrl}
  //             commu={post.community.name}
  //             author={post.author.name}
  //             title={post.title}
  //             content={post.content}
  //             createdAt={post.createdAt}
  //             votesAmt={votesAmt}
  //             currentVote={currentVote}
  //           />
  //         );
  //       }
  //     })}

  //     {isFetchingNextPage && (
  //       <li className="flex justify-center">
  //         <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
  //       </li>
  //     )}
  //   </ul>
  // );
};

export default PostsFeed;
