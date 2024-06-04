"use client";

import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import SearchTab from "@/components/SearchTab";
import {InfiniteData, useInfiniteQuery} from "@tanstack/react-query";
import {GetSearchQuery} from "@/services/common";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatTimeToNow} from "@/lib/utils";
import Link from "next/link";
import {Frown, Loader2} from "lucide-react";
import {useRouter} from "next-nprogress-bar";
import {useInView} from "react-intersection-observer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClipLoader from "react-spinners/ClipLoader";
import {ScrollArea} from "@/components/ui/scroll-area";

const sortTimeoptions = [
  {value: "all", label: "All Time"},
  {value: "year", label: "Past Year"},
  {value: "month", label: "Past Month"},
  {value: "week", label: "Past Week"},
  {value: "day", label: "Past 24 Hours"},
  {value: "hour", label: "Past Hour"},
];

const sortOptions = [
  {value: "relevance", label: "Relevance"},
  {value: "new", label: "Newest"},
  {value: "comments", label: "Most Comments"},
  {value: "votes", label: "Most Votes"},
];

const Page = () => {
  const searchParams = useSearchParams();
  const {ref, inView} = useInView();
  const query = searchParams.get("q");
  const searchType = searchParams.get("type");
  const router = useRouter();

  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const {
    data: queryResults,
    status,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search", searchType, query, timeFilter, sortBy],
    queryFn: ({pageParam}) =>
      GetSearchQuery(
        pageParam,
        query || "",
        searchType || "",
        sortBy,
        timeFilter
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  const handleSelectTime = (value: string) => {
    setTimeFilter(value);
    router.replace(
      `search?q=${query}&type=${searchType}&sort=${sortBy}&time=${value}`
    );
  };

  const handleSelectSort = (value: string) => {
    setSortBy(value);
    router.replace(
      `search?q=${query}&type=${searchType}&sort=${value}${value === "new" ? "" : `&time=${timeFilter}`}`
    );
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      <ScrollArea className="h-full pt-6 px-52" ref={ref}>
        <div className="col-span-2 py-6 px-4">
          <SearchTab queryKey={query} searchType={searchType} />
          {searchType === "posts" ? (
            <div className="flex items-center py-2">
              <div className="mr-2">Sort by: </div>
              <div className="flex space-x-2">
                <Select onValueChange={handleSelectSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sortBy !== "new" && (
                  <Select onValueChange={handleSelectTime}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortTimeoptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <hr className="flex-grow ml-2 my-4 border-gray-300 dark:border-gray-700" />
            </div>
          ) : (
            <hr className="flex-grow  my-4 border-gray-300 dark:border-gray-700" />
          )}

          {searchType === "posts" ? (
            <PostsRender queryResults={queryResults} isPending={isPending} />
          ) : searchType === "communities" ? (
            <CommunitiesRender
              queryResults={queryResults}
              isPending={isPending}
            />
          ) : null}
        </div>
      </ScrollArea>
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </>
  );
};

type PostsRenderProps = {
  queryResults: InfiniteData<any[], unknown> | undefined;
  isPending: boolean;
};

type CommunitiesRenderProps = {
  queryResults: InfiniteData<any[], unknown> | undefined;
  isPending: boolean;
};

const PostsRender = ({queryResults, isPending}: PostsRenderProps) => {
  if (isPending) {
    return (
      <div className="grid items-center place-content-center h-full">
        <ClipLoader color="#000000" />
      </div>
    );
  }

  const posts = queryResults?.pages.flatMap((page) => page) || [];

  return (
    <div className="grid gap-2">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link
            href={`community/${post.community.slug}/post/${post.id}`}
            className="mb-4"
            key={post.id}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2 text-gray-600">
                  <Avatar>
                    <AvatarImage src={post.community.profileImage} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{post.community.name}</p>
                  <p className="text-sm">·</p>
                  <p className="text-sm">
                    {formatTimeToNow(new Date(post.createdAt))}
                  </p>
                </div>
                <div className="text-lg">{post.title}</div>
                <div className="text-sm text-gray-600">
                  {post.votes.length} votes · {post.comments.length} comments
                </div>
              </div>

              {post.imageUrl && (
                <div className="flex-shrink-0 w-32 h-24">
                  <img
                    src={post.imageUrl}
                    alt="image"
                    className="object-cover rounded-md"
                    style={{width: "100%", height: "100%"}}
                  />
                </div>
              )}
            </div>
            {posts.indexOf(post) !== posts.length - 1 && (
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
            )}
          </Link>
        ))
      ) : (
        <div className="mx-auto flex items-center space-x-2 p-4">
          <div className="shrink-0">
            <Frown />
          </div>
          <div>
            <p className="text-slate-500">No results found for posts.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CommunitiesRender = ({
  queryResults,
  isPending,
}: CommunitiesRenderProps) => {
  const communities = queryResults?.pages.flatMap((page) => page) || [];

  if (isPending) {
    return (
      <div className="grid items-center place-content-center h-full">
        <ClipLoader color="#000000" />
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {communities.length > 0 ? (
        communities.map((community, index) => (
          <Link
            href={`community/${community.slug}`}
            key={`community-${community.id}-${index}`}
            className=""
          >
            <div className="mx-auto flex space-x-4 ">
              <span className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full mt-2">
                <img
                  src={community.profileImage}
                  alt="profileImage"
                  className="aspect-square h-full w-full"
                />
              </span>
              <div>
                <div className="text-xl font-medium text-black">
                  {community.name}
                </div>
                <p className="text-gray-400 text-xs pt-1">
                  {community._count.subscribers} members ·{" "}
                  {community._count.posts} posts
                </p>
                <p className="text-gray-700 text-sm">{community.description}</p>
              </div>
            </div>
            {communities.indexOf(community) !== communities.length - 1 && (
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
            )}
          </Link>
        ))
      ) : (
        <div className="mx-auto flex items-center space-x-2 p-4">
          <div className="shrink-0">
            <Frown />
          </div>
          <div>
            <p className="text-slate-500">No results found for communities.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
