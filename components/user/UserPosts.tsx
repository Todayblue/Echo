"use client";
import {POST_PER_PAGE} from "@/lib/constants";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import {Comment, Post, Community, User, Vote, VoteType} from "@prisma/client";
import axios from "axios";
import {Loader2} from "lucide-react";
import PostCard from "../community/PostCard";
import {useSession} from "next-auth/react";

type ExtendedPost = Post & {
  community: Community;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

type PostsFeedProps = {
  initPosts: ExtendedPost[];
  fetchPostsUrl: string;
};

const PostsFeed = ({initPosts, fetchPostsUrl}: PostsFeedProps) => {
  const {data: session} = useSession();
  const {ref, inView} = useInView();
  const fetchPosts = async ({pageParam}: {pageParam: number}) => {
    const {data} = await axios.get(
      `${fetchPostsUrl}page=${pageParam}&limit=${POST_PER_PAGE}`
    );
    return data;
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
