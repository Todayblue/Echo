import prisma from "@/lib/prisma";
import { Post, User } from "@prisma/client";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CommunityPostProps {
  communitySlug: string | null;
  post: ExtendedPost;
}

type ExtendedPost = Post & {
  author: User;
};

const CommunityPost = async ({ communitySlug, post }: CommunityPostProps) => {
  const commentsCount = await prisma.comment.count({
    where: {
      postId: post.id,
    },
  });

  return (
    <div className="grid gap-y-1 px-6 py-3 ">
      <Link href={`community/${communitySlug}/post/${post.id}`}>
        <p className="hover:underline font-bold text-md">{post.title}</p>
      </Link>
      <div className="flex flex-row justify-between text-sm text-gray-400 items-center gap-x-2">
        <div className="flex flex-row space-x-2">
          <h3>Posted by : {post.author.name}</h3>
          <p>
            {format(new Date(post.createdAt), "MMM d, yyyy", {
              locale: enUS,
            })}
          </p>
        </div>
        <div className="flex flex-row space-x-1">
          <p>{commentsCount}</p>
          <MessageSquare />
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;
