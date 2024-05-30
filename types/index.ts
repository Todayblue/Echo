import {Icons} from "@/components/icons";
import {
  Subscription,
  Community,
  Post,
  Vote,
  User,
  Comment,
} from "@prisma/client";

interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

interface PopularCommunities extends Community {
  subscribers: Subscription[];
}

interface ExtendedPost extends Post {
  community: Community;
  votes: Vote[];
  author: User;
  comments: Comment[];
}

interface CommunityTable {
  id: string;
  name: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  profileImage: string | null;
  createdAt: string | null;
  status: string | null;
  createBy: string | null;
}

interface BlogTable {
  id: number;
  createdAt: string | null;
  slug: string | null;
  title: string;
  coverImage: string;
  createBy: string | null;
  tags: string[] | null;
}

interface SearchPostParams {
  community?: string | null;
  page: number;
  limit: number;
  time?: "year" | "month" | "week" | "day" | "hour" | null;
  sort?: "new" | "comments" | "votes" | null;
}

interface SearchUserPostParams {
  searchType: "posts" | "upvote" | "downvote" | "community" | null;
  page: number;
  limit: number;
  time?: "year" | "month" | "week" | "day" | "hour" | null;
  sort?: "new" | "comments" | "votes" | null;
}

export type {
  CommunityTable,
  ExtendedPost,
  NavItem,
  NavItemWithChildren,
  NavItemWithOptionalChildren,
  FooterItem,
  PopularCommunities,
  BlogTable,
  SearchPostParams,
  SearchUserPostParams,
};

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
