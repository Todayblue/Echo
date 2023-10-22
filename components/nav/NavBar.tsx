"use client";
import React from "react";
import { ModeToggle } from "../ModeToggle";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";

const munuBar = [
  {
    name: "Blog",
    link: "http://localhost:3000/blog",
  },
  {
    name: "Forum",
    link: "http://localhost:3000/forum",
  },
];

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-2 ">
      <div className="flex items-center justify-between h-10 gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            DogWorld
          </p>
        </Link>
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={session?.user} />
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
