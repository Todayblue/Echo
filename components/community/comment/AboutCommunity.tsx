import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";

type AboutCommunityProp = {
  memberCount: number;
  createdAt: Date | null;
  creatorId: string;
  slug: string | null;
  session: {
    user: {
      name: string;
      email: string;
      id: string;
    };
  } | null;
};

const AboutCommunity = ({
  memberCount,
  creatorId,
  createdAt,
  slug,
  session,
}: AboutCommunityProp) => {
  return (
    <div className="w-screen md:w-full bg-white h-fit rounded-lg border border-gray-300 order-first md:order-last">
      <div className="mx-6 pt-4 ">
        <p className="font-semibold py-3 border-b border-gray-300 ">
          About Community
        </p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-4 ">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-700">
            <time dateTime={createdAt?.toDateString()}>
              {createdAt ? format(createdAt, "MMMM d, yyyy") : "N/A"}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Members</dt>
          <dd className="flex items-start gap-x-2">
            <div className="text-gray-900">{memberCount}</div>
          </dd>
        </div>
        {creatorId === session?.user?.id ? (
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">You created this community</dt>
          </div>
        ) : null}
        <Link href={`/community/${slug}/post/create`}>
          <Button className="w-full">Create Post</Button>
        </Link>
      </dl>
    </div>
  );
};

export default AboutCommunity;
