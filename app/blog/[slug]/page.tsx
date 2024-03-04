import BlogSlugPage from "@/components/blog/BlogSlugPage";
import prisma from "@/lib/prisma";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const blog = await prisma.blog.findFirst({
    where: {
      slug: slug,
    },
    include: {
      tags: true,
      author: true,
    },
  });

  if (!blog) {
    return null;
  }
  return <BlogSlugPage blog={blog} />;
};

export default Page;
