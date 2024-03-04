import Link from "next/link";
import React from "react";
import CommunityAvatar from "./community/CommunityAvatar";
import {Community} from "@prisma/client";

type Props = {
  communityFollower: Community[];
};

const FollowerCommunity = ({communityFollower}: Props) => {
  return (
    <div className="bg-white">
      <div className="w-full h-auto rounded-md border bg-white">
        <div className="border-b bg-secondary px-6 py-3">
          <p className="tracking-wide text-base text-gray-700 font-semibold capitalize">
            your follower community
          </p>
        </div>
        <div className="mx-6 ">
          {communityFollower.map((community) => (
            <div
              key={community.id}
              className="grid grid-cols-10 space-y-4 items-center border-b"
            >
              <Link
                className="col-span-1 shrink-0"
                href={`/community/${community.slug}`}
              >
                <CommunityAvatar
                  communityName={community.name}
                  profileImage={community.profileImage || ""}
                  className="w-12 h-12"
                />
              </Link>
              <div className="w-full col-span-9 ">
                <Link href={`/community/${community.slug}`}>
                  <h1 className="text-xl font-semibold hover:underline ">
                    {community.name}
                  </h1>
                </Link>
                <p className="text-sm text-muted-foreground text-gray-300">
                  {community.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowerCommunity;
