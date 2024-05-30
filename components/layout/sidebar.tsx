import {DashboardNav} from "@/components/dashboard-nav";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";
import {NavItem} from "@/types";
import {ScrollArea} from "../ui/scroll-area";

export default async function Sidebar() {
  const session = await getAuthSession();

  let userCommunities = await prisma.community.findMany({
    include: {
      subscribers: {
        where: {
          userId: session?.user.id,
        },
      },
    },
    where: {
      isActive: true,
      subscribers: {
        some: {
          userId: session?.user.id,
        },
      },
    },
  });

  if (!session?.user) {
    userCommunities = [];
  }

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
      icon: "home",
      label: "Home",
    },
    {
      title: "Post",
      href: `/post/create`,
      icon: "squarePen",
      label: "Post",
    },
    {
      title: "Blog",
      href: "/blog/tag/all",
      icon: "book",
      label: "blog",
    },
  ];

  if (session?.user) {
    navItems.push(
      {
        title: "Profile",
        href: `/user/${session?.user.username}`,
        icon: "profile",
        label: "profile",
      },
      {
        title: "Community",
        href: `/community/create`,
        icon: "badgePlus",
        label: "Community",
      }
    );
  }

  return (
    <ScrollArea
      className={cn(`relative hidden h-full border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <DashboardNav userCommunities={userCommunities} items={navItems} />
        </div>
      </div>
    </ScrollArea>
  );
}
