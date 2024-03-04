import BlogLayout from "@/components/blog/BlogLayout";
import BlogTags from "@/components/blog/BlogTags";
import prisma from "@/lib/prisma";
import React from "react";

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const tags = await prisma.tag.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let whereCondition = {};
  if (slug !== "all") {
    whereCondition = {
      tags: {
        some: {
          slug: {
            contains: slug,
          },
        },
      },
    };
  }

  const blogs = await prisma.blog.findMany({
    where: whereCondition,
    include: {
      author: true,
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allTags = [{ slug: "all", name: "all" }, ...tags];

  return (
    <div className="bg-white h-screen pt-2">
      <div className="grid mx-auto w-4/5 gap-x-6 py-6">
        <article className=" flex flex-col">
          <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
            <h1 className="font-semibold text-2xl md:text-4xl lg:text-5xl">
              #{slug}
            </h1>
            <span className="mt-2 inline-block">
              Discover more categories and expand your knowledge!
            </span>
          </div>
          <div className="px-12 pt-6">
            <BlogTags tags={allTags} currentSlug={slug} />
          </div>

          <div className="grid  grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 grid-rows-2 gap-16  my-8 px-5 ">
            {blogs.map((blog) => (
              <article key={blog.id} className="col-span-1 row-span-1 relative">
                <BlogLayout blog={blog} />
              </article>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Page;
