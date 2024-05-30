"use client";
import React from "react";

import {navigationMenuTriggerStyle} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {useRouter} from "next-nprogress-bar";

type Props = {
  queryKey: string | null;
  searchType: string | null;
};

const SearchTab = ({queryKey, searchType}: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center">
      <div>
        <p className="text-gray-700 text-sm font-medium pr-4">SEARCH RESULTS</p>
      </div>
      <div
        className={`${navigationMenuTriggerStyle()} hover:cursor-pointer ${searchType === "posts" ? "bg-gray-100" : ""}`}
      >
        <Link
          href={`/search?q=${queryKey}&type=posts`}
          data-prevent-nprogress={true}
          className="font-semibold"
          onClick={() => router.push(`/search?q=${queryKey}&type=posts`)}
        >
          Posts
        </Link>
      </div>

      <div
        className={`${navigationMenuTriggerStyle()} hover:cursor-pointer ${searchType === "communities" ? "bg-gray-100" : ""}`}
      >
        <Link
          href={`/search?q=${queryKey}&type=communities`}
          onClick={() => router.push(`/search?q=${queryKey}&type=communities`)}
          data-prevent-nprogress={true}
          className="font-semibold"
        >
          Communities
        </Link>
      </div>

      {/* <div
        className={`${navigationMenuTriggerStyle()} hover:cursor-pointer ${searchType === "comments" ? "bg-gray-100" : ""}`}
      >
        <Link
          href={`/search?q=${queryKey}&type=comments`}
          legacyBehavior
          passHref
          className="font-semibold"
        >
          Comments
        </Link>
      </div> */}
    </div>
  );
};

export default SearchTab;
