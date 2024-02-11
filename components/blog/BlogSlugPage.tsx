import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Blog, Tag, User } from "@prisma/client";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "../ui/button";
import prisma from "@/lib/prisma";
import BlogLayout from "./BlogLayout";

type ExtendedBlogProps = Blog & {
  tags: Tag[];
  author: User;
};

type BlogProps = {
  blog: ExtendedBlogProps;
};

const BlogSlugPage = async ({ blog }: BlogProps) => {
  const relatePost = await prisma.blog.findMany({
    include: {
      author: true,
      tags: true,
    },
    where: {
      tags: {
        some: {
          id: {
            in: blog.tags.map((tag) => tag.id),
          },
        },
      },
      id: {
        not: blog.id,
      },
    },
    take: 3,
  });

  return (
    <div className="grid grid-cols-6 gap-4 pt-10 px-6">
      <div className="col-span-1 pl-4">
        <Link href={"/blog/tag/all"}>
          <Button>🡐 All Posts</Button>
        </Link>
      </div>
      <div className="col-span-4 pb-14">
        <p className="font-medium text-gray-600 pb-2 ">
          {`Published ${format(new Date(blog.createdAt), "MMM d, yyyy", {
            locale: enUS,
          })}`}
        </p>
        <p className="text-4xl font-semibold py-2 grid-flow-row-dense">
          {blog.title}
        </p>
        <div className="flex items-center space-x-1 px-2">
          <Image
            src={blog.author.image || ""}
            width={25}
            height={25}
            alt="profileImage"
            className="rounded-full"
          />
          <p className="font-semibold text-gray-900 text-sm">
            {`By ${blog.author.name}`}
          </p>
        </div>
        <div className="flex justify-center py-8">
          <Image
            src={blog.coverImage || ""}
            alt="coverImage"
            width={550}
            height={400}
          />
        </div>
        {blog.content && (
          <article
            className="content "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></article>
        )}
        <hr className="h-px my-8 bg-secondary border-0 " />
        <div className="">
          <h2 className="px-2 text-4xl font-semibold grid-flow-row-dense mb-3">
            Relate Articles
          </h2>
          <div className="grid grid-cols-3 gap-6 ">
            {relatePost &&
              relatePost.map((post) => (
                <div key={post.id}>
                  <BlogLayout blog={post} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSlugPage;
