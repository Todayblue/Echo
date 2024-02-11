import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Blog, Tag, User } from "@prisma/client";
import ImageGrid from "../loading/ImageGrid";

type ExtendedBlogProps = Blog & {
  tags: Tag[];
  author: User;
};

type BlogProps = {
  blogs: ExtendedBlogProps[];
  isLoading?: boolean;
};

const BlogList = ({ blogs, isLoading }: BlogProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-4  place-items-center ">
      {blogs.map((blog) => (
        <div key={blog.id} className="flex justify-center items-center">
          <div
            key={blog.id}
            className="border max-w-sm rounded-lg shadow dark:bg-gray-800  mb-4 duration-300 hover:scale-105 "
          >
            <Link href={`/blog/${blog.slug}`} className="h-[145px]">
              <Image
                alt="coverImage"
                src={blog.coverImage || ""}
                width={385}
                height={145}
                className="max-w-md aspect-video w-full object-cover rounded-t-lg"
              />
            </Link>
            <div className="px-4">
              <Link href={`/blog/${blog.slug}`}>
                <div className="mb-1 mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {blog.title}
                </div>
              </Link>
              <p
                dangerouslySetInnerHTML={{
                  __html: blog.content.toLowerCase(),
                }}
                className="line-clamp-3 font-normal text-sm"
              ></p>
            </div>
            <div className="flex justify-between px-4 py-3">
              <div className="flex items-center space-x-1">
                <Image
                  src={blog.author.image || ""}
                  width={30}
                  height={30}
                  alt="profileImage"
                  className="rounded-full"
                />
                <p className="font-bold text-gray-700 text-sm">
                  {`By ${blog.author.name}`}
                </p>
              </div>
              <div className="pt-2 flex flex-row items-center space-x-1 font-medium">
                {blog.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                    <Badge variant="outline">{tag.name.toLowerCase()}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
