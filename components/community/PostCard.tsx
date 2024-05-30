"use client";

import {formatTimeToNow} from "@/lib/utils";
import {Vote} from "@prisma/client";
import {Dot, MessageCircle, MessageSquare} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import PostVoteClient from "./vote/PostVoteClient";
import Video from "../Video";
import GoogleMap from "../GoogleMap";

type PartialVote = Pick<Vote, "type">;

type PostCardProps = {
  id: string;
  slug: string | null;
  commu?: string;
  author: string | null;
  title: string;
  image: string | null;
  content: string | null;
  createdAt: Date;
  videoUrl?: string | null;
  communityImg: string | null;
  comunityName: string | null;
  lat?: string | null;
  lng?: string | null;
  commentsCount: number;
  currentVote?: PartialVote;
  votesAmt: number;
};

const PostCard = ({
  id,
  comunityName,
  communityImg,
  slug,
  author,
  title,
  image,
  videoUrl,
  content,
  createdAt,
  commentsCount,
  votesAmt,
  currentVote,
  lat,
  lng,
}: PostCardProps) => {
  const cleanContent = content?.replace(
    /<br\s?\/?>|<u\s?\/?>|<strong\s?\/?>|<em\s?\/?>/g,
    ""
  );
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className=" w-full">
      <div className="border border-gray-300  bg-white  p-4 flex leading-normal rounded-lg">
        <PostVoteClient
          postId={id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />
        <div className="mb-4 w-full">
          <div className="flex  justify-between pb-2">
            <div className="flex flex-row justify-center items-center">
              <Link
                href={`/community/${slug}`}
                className="flex flex-row hover:text-blue-900 justify-center items-center"
              >
                <img
                  className="w-6 h-6 rounded-full"
                  src={communityImg || ""}
                  alt={comunityName || ""}
                />
                <div className="ml-2">
                  <p className="text-sm font-medium">{comunityName}</p>
                </div>
              </Link>
              <Dot size={16} className="text-gray-400" />
              <div className="text-sm text-gray-400 flex  gap-x-2">
                <h3 className="">Posted by : {author}</h3>
                <p>{formatTimeToNow(new Date(createdAt))}</p>
              </div>
            </div>
            <div className="flex flex-row space-x-1 ">
              <MessageSquare width={16} height={16} className="text-gray-400" />
              <p className="text-gray-400 text-sm ">{commentsCount}</p>
            </div>
          </div>

          <Link href={`/community/${slug}/post/${id}`}>
            <div className="font-semibold text-xl">{title}</div>

            {image && (
              <figure className="flex justify-center py-4">
                <Image
                  src={image}
                  alt={`picture of ${author}`}
                  width={500}
                  height={500}
                  className="m-h-[512px]"
                  priority={true}
                />
              </figure>
            )}
            {videoUrl && (
              <Video
                src={videoUrl}
                className="m-h-[512px] rounded-sm w-full object-contain"
              />
            )}
            <div
              className="relative text-sm max-h-40 w-full overflow-clip"
              ref={pRef}
            >
              {cleanContent ? (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{__html: cleanContent}}
                />
              ) : null}

              {lat && lng ? (
                <div>
                  <div className="w-full h-60 py-2">
                    <GoogleMap lat={lat} lng={lng} />
                  </div>
                </div>
              ) : null}
              {/* h-40 = 160px */}
              {pRef.current?.clientHeight === 160 ? (
                // blur bottom if content is too long
                <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
              ) : null}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
