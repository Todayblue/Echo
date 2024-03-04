import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Session, User } from "@prisma/client";

type UserTabsProps = {
  user: User;
};

const UserTabs = ({ user }: UserTabsProps) => {
  return (
    <Tabs className="w-full">
      <TabsList className="grid px-32 grid-cols-10 rounded-none  border-b">
        <TabsTrigger value="overview">
          <Link href={`/user/${user.username}`}>OVERVIEW</Link>
        </TabsTrigger>
        <TabsTrigger value="posts">
          <Link href={`/user/${user.username}/post`}>POSTS</Link>
        </TabsTrigger>
        <TabsTrigger value="upvoted">
          <Link href={`/user/${user.username}/upvote`}>UPVOTED</Link>
        </TabsTrigger>
        <TabsTrigger value="downvoted">
          <Link href={`/user/${user.username}/downvote`}>DOWNVOTED</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UserTabs;
