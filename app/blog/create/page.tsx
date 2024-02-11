import CreateBlog from "@/components/blog/CreateBlog";
import prisma from "@/lib/prisma";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const blogTags = await prisma.tag.findMany({});

  return <CreateBlog blogTags={blogTags} />;
};

export default page;
