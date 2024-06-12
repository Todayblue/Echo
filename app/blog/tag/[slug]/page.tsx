"use client";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogLayout from "@/components/blog/BlogLayout";
import BlogTags from "@/components/blog/BlogTags";
import {ScrollArea} from "@/components/ui/scroll-area";
import React from "react";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import axios from "axios";
import {Blog, Tag, User} from "@prisma/client";
import {BLOG_ITEM_PER_PAGE} from "@/lib/constants";
import ClipLoader from "react-spinners/ClipLoader";

type TagDto = Pick<Tag, "name" | "slug">;
type BlogDto = {
  blogs: ({
    tags: Tag[];
    author: User;
  } & Blog)[];
  blogCount: number;
};

const Page = ({params: {slug}}: {params: {slug: string}}) => {
  const [page, setPage] = React.useState(1);

  const fetchBlogs = async (page = 1) => {
    try {
      const {data} = await axios.get<BlogDto>(
        `/api/blog?tag=${slug}&page=${page}&limit=${BLOG_ITEM_PER_PAGE}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTags = async () => {
    try {
      const {data} = await axios.get<TagDto[]>(`/api/blog/tag`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const {isPending, isError, error, data, isFetching, isPlaceholderData} =
    useQuery({
      queryKey: ["projects", page],
      queryFn: () => fetchBlogs(page),
      placeholderData: keepPreviousData,
    });

  const {data: tags} = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
  });

  const allTags = [{slug: "all", name: "all"}, ...(tags || [])];

  if (isPending || isFetching) {
    return (
      <div className="grid items-center place-content-center h-full">
        <ClipLoader color="#000000" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full px-36 pt-10 flex flex-col pb-6">
        <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
          <h1 className="font-semibold text-2xl md:text-4xl lg:text-5xl">
            #{slug}
          </h1>
        </div>
        <div className="px-12 pt-6">
          <BlogTags tags={allTags} currentSlug={slug} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 grid-rows-2 gap-16  my-8 px-5 ">
          {data?.blogs.map((blog) => (
            <article key={blog.id} className="col-span-1 row-span-1 relative">
              <BlogLayout blog={blog} />
            </article>
          ))}
        </div>
        <BlogPagination
          currentPage={page}
          totalItems={data?.blogCount || 0}
          url={"/blog"}
          isLoading={isPending}
          onPageChange={setPage}
          currentTag={slug}
        />
      </ScrollArea>
    </>
  );
};

export default Page;
