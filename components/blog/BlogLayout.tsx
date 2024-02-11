import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Blog, Tag, User } from "@prisma/client";
import { Badge } from "../ui/badge";

type ExtendedBlog = Blog & {
  tags: Tag[];
  author: User;
};

type Props = {
  blog: ExtendedBlog;
};

const BlogLayout = ({ blog }: Props) => {
  return (
    <div className="group flex flex-col items-center">
      <Link href={`/blog/${blog.slug}`}>
        <Image
          width={360}
          height={290}
          src={blog.coverImage}
          alt={blog.title}
          className="aspect-[4/3] w-full rounded-lg object-cover object-center  group-hover:scale-105 transition-all ease duration-300"
        />
      </Link>

      <div className="flex flex-col w-full mt-4">
        <span className="uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {/* {blog.tags} */}

          <div className="flex flex-row space-x-2">
            {blog.tags.map((tag) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <Badge variant="secondary">{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </span>
        <Link href={`/blog/${blog.slug}`} className="inline-block my-1">
          <h2 className="font-semibold capitalize  text-base sm:text-lg">
            <span className="hover:underline">{blog.title}</span>
          </h2>
        </Link>

        <span className="capitalize text-gray dark:text-white/50 font-semibold text-sm  sm:text-base">
          {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
};

export default BlogLayout;
