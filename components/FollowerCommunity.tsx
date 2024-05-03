import Link from "next/link";
import React from "react";
import CommunityAvatar from "./community/CommunityAvatar";
import {Community} from "@prisma/client";
import TaskList from "./loading/TaskList";

type Props = {
  communityFollower: Community[];
};

const FollowerCommunity = ({communityFollower}: Props) => {
  if (!communityFollower) {
    <TaskList />;
  }

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
            <div className="border-b py-4" key={community.id}>
              <div className="flex items-center">
                <Link href={`/community/${community.slug}`} className="mr-4">
                  <CommunityAvatar
                    communityName={community.name}
                    profileImage={community.profileImage || ""}
                    className="w-12 h-12"
                  />
                </Link>
                <div className="w-full">
                  <Link href={`/community/${community.slug}`}>
                    <h1 className="text-xl font-semibold hover:underline">
                      {community.name}
                    </h1>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {community.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowerCommunity;
