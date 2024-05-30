"use client";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {format} from "date-fns";
import {Community, Rule, Subscription} from "@prisma/client";
import {Card} from "@/components/ui/card";

type CommunityDetails = {
  community?: Community;
  memberCount: number;
};

const AboutCommunity = ({
  memberCount,
  community,
}: CommunityDetails) => {
  return (
    <Card className="order-first md:order-last">
      <div className="mx-6 pt-4 ">
        <p className="font-semibold py-3 border-b border-gray-300 ">
          {community?.title}
        </p>
        <p className="pt-3 text-sm text-muted-foreground">
          {community?.description}
        </p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-4 ">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-700">
            <time dateTime={community?.createdAt?.toString()}>
              {community?.createdAt
                ? format(community.createdAt, "MMMM d, yyyy")
                : "N/A"}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Members</dt>
          <dd className="flex items-start gap-x-2">
            <div className="text-gray-900">{memberCount}</div>
          </dd>
        </div>
        {/* {creatorId ===  ? (
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">You created this community</dt>
          </div>
        ) : null} */}
        <Link href={`/community/${community?.slug}/post/create`}>
          <Button className="w-full">Create Post</Button>
        </Link>
      </dl>
    </Card>
  );
};

export default AboutCommunity;
