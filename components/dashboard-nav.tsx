"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

import {Icons} from "@/components/icons";
import {cn} from "@/lib/utils";
import {NavItem} from "@/types";
import {Dispatch, SetStateAction} from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Role, Session} from "@prisma/client";
import {useSession} from "next-auth/react";

interface DashboardNavProps {
  items: NavItem[];
  userCommunities: {
    id: string;
    slug: string | null;
    name: string;
    profileImage: string | null;
  }[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({
  items,
  setOpen,
  userCommunities,
}: DashboardNavProps) {
  const path = usePathname();
  const {data: session} = useSession();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <div>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          );
        })}
      </div>
      <hr className="mx-1 border-gray-300 " />

      {session?.user.role == Role.ADMIN && (
        <div className="px-3 pb-2">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" defaultValue="item-1">
              <AccordionTrigger className="text-sm text-gray-600">
                Admin
              </AccordionTrigger>
              <AccordionContent>
                <Link href={"/admin/blog"}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === "/admin/blog" ? "bg-accent" : "transparent"
                    )}
                  >
                    <span>Blog</span>
                  </span>
                </Link>
              </AccordionContent>
              <AccordionContent>
                <Link href={"/admin/community"}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      path === "/admin/community" ? "bg-accent" : "transparent"
                    )}
                  >
                    <span>Community</span>
                  </span>
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      {userCommunities && userCommunities.length > 0 && (
        <div className="px-3 pb-2">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" defaultValue="item-1">
              <AccordionTrigger className="text-sm text-gray-600">
                Communities
              </AccordionTrigger>
              {userCommunities.map((community) => (
                <Link key={community.id} href={`/community/${community.slug}`}>
                  <AccordionContent onChange={(e) => console.log("e", e)}>
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={community.profileImage || ""}
                        alt={community.name}
                      />
                      <div className="ml-2">
                        <p className="text-sm font-medium">{community.name}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </Link>
              ))}
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </nav>
  );
}
