import CreateBlog from "@/components/blog/CreateBlog";
import CreateCommunityPost from "@/components/community/post/CreateCommunityPost";
import prisma from "@/lib/prisma";
import React from "react";

type Props = {};

const page = (props: Props) => {
  const blogTags = prisma.tag.findMany({});

  return <CreateBlog />;
};

export default page;
