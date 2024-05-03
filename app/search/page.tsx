"use client";

import {useSearchParams} from "next/navigation";
import React, {Suspense} from "react";
import SearchTab from "@/components/SearchTab";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {format} from "date-fns";
import {enUS} from "date-fns/locale";
import {GetSearchQuery} from "@/services/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {formatTimeToNow} from "@/lib/utils";

const Page = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("q");
  const type = searchParams.get("type");

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: () => GetSearchQuery(query || "", type || ""),
    queryKey: ["search"],
  });

  console.log("🚀 -------------------------------🚀");
  // console.log("🚀 ~ queryResults:", queryResults?.map(post) => post.votes);
  console.log("result", queryResults);
  console.log("🚀 -------------------------------🚀");

  return (
    <div className="grid min-h-screen bg-white">
      <div className="grid grid-cols-4">
        <div className="col-span-1"></div>
        <div className="col-span-2 py-6 px-4">
          <SearchTab />
          <hr className="h-px my-4 bg-gray-200 border-1 dark:bg-gray-700" />
          <div className="grid gap-2">
            {queryResults?.map((post) => (
              <>
                <Card className="flex flex-row justify-between p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-row items-center space-x-2 text-gray-600 ">
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
                      {post.votes.length} votes
                      {/* 14k votes · 548 comments */}
                    </div>
                  </div>
                  <div>
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt="image"
                        width={136}
                        height={102}
                        className="rounded-md"
                      />
                    )}
                  </div>
                </Card>
              </>
            ))}
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
    </div>
  );
};

export default Page;
