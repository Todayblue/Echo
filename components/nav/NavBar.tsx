"use client";
import React from "react";
import {ModeToggle} from "../ModeToggle";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {MainNav} from "./MainNav";
import {UserNav} from "./UserNav";
import SearchBar from "../SearchBar";
import {cn} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {get} from "http";
import axios from "axios";
import {Notification} from "@prisma/client";

const NavBar = () => {
  const {data: session} = useSession();



  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20 ">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/"} className="flex items-center gap-2">
            <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
              Echo
            </p>
          </Link>
        </div>
        <SearchBar />

        <div className="flex items-center gap-2">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <UserNav user={session?.user} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
