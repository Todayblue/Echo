import prisma from "@/lib/prisma";
import BlogForm from "@/components/blog/BlogForm";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Role} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import NoPermissionPage from "@/components/NoPermissionPage";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const session = await getAuthSession();

  if (session?.user.role !== Role.ADMIN || !session?.user) {
    return <NoPermissionPage />;
  }

  const blog = await prisma.blog.findFirstOrThrow({
    where: {
      slug: slug,
    },
    include: {
      tags: true,
    },
  });

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <ScrollArea className="h-full flex-1 space-y-4 p-6">
      <div className="pb-2">
        <h3 className="text-lg font-medium ">Update blog</h3>
      </div>
      <Separator />
      <div className="px-52">
        <BlogForm defaultValues={blog} tags={tags} />
      </div>
    </ScrollArea>
  );
}
