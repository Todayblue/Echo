"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Vote } from "@prisma/client";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PostVoteClient from "./vote/PostVoteClient";

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

  currentVote?: PartialVote;
  votesAmt: number;
};

const PostCard = ({
  id,
  commu,
  slug,
  author,
  title,
  image,
  content,
  createdAt,
  votesAmt,
  currentVote,
}: PostCardProps) => {
  const cleanContent = content?.replace(
    /<br\s?\/?>|<u\s?\/?>|<strong\s?\/?>|<em\s?\/?>/g,
    ""
  );
  const pRef = useRef<HTMLParagraphElement>(null);
  const [isLongContent, setIsLongContent] = useState(false);

  useEffect(() => {
    pRef.current?.clientHeight === 160 && setIsLongContent(true);
  }, []);

  return (
    <div className=" w-full">
      <div className="border border-gray-300  bg-white  p-4 flex leading-normal rounded-lg">
        <PostVoteClient
          postId={id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />
        <div className="mb-4">
          <div className="flex items-center">
            <h1 className="hover:underline">
              <Link href={`/community/${slug}`}>c/{commu}</Link>
            </h1>
            <Dot size={20} className="text-gray-500" />
            <div className="text-sm text-gray-400 flex items-center gap-x-2">
              <h3 className="">Posted by : {author}</h3>
              <p>{formatTimeToNow(new Date(createdAt))}</p>
            </div>
          </div>

          <Link href={`/community/${slug}/post/${id}`}>
            <div className="text-gray-900 font-bold text-xl">{title}</div>

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
            <div
              className="relative text-sm max-h-40 w-full overflow-clip"
              ref={pRef}
            >
              {cleanContent ? (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: cleanContent }}
                />
              ) : null}
              {/* h-40 = 160px */}
              {isLongContent ? (
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
