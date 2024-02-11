import React from "react";
import Link from "next/link";
import BlogLayout from "./BlogLayout";
import prisma from "@/lib/prisma";
import { Button } from "../ui/button";

const RecentBlogPosts = async () => {
  const blogs = await prisma.blog.findMany({
    take: 3,
    include: {
      tags: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full h-auto rounded-md border bg-white">
      <div className="border-b bg-secondary  px-6 py-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold ">Recent Blog Posts</h2>
          <Link
            href="blog/tag/all"
            className="font-semibold text-base hover:underline "
          >
            Read More
          </Link>
        </div>
      </div>
      <section className="w-full flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 m-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="col-span-1 row-span-1 relative">
              <BlogLayout blog={blog} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RecentBlogPosts;
