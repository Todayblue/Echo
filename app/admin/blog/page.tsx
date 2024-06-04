import {format} from "date-fns";
import {BlogClient} from "@/components/tables/blog-tables/client";
import prisma from "@/lib/prisma";
import {BlogTable} from "@/types";
import {Role} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import NoPermissionPage from "@/components/NoPermissionPage";

export default async function page() {
  const session = await getAuthSession();

  if (session?.user.role !== Role.ADMIN || !session?.user) {
    return <NoPermissionPage />;
  }

  const blogs = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tableData: BlogTable[] = blogs.map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    tags: blog.tags.map((tag) => tag.name),
    coverImage: blog.coverImage,
    createBy: blog.author?.name || "",
    createdAt: format(blog.createdAt?.toDateString() || "", "MMMM d, yyyy"),
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BlogClient data={tableData} />
      </div>
    </>
  );
}
