"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";

type UserProps = {
  user: User | null;
};

export function UserNav({ user }: UserProps) {
  if (!user) {
    return (
      <Button variant={"outline"} size={"sm"}>
        <Link href="/user/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      {user ? (
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      ) : (
        <Button variant="default" size="sm">
          <Link href="/user/sign-in">Sign in</Link>
        </Button>
      )}

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/blog/tag/all">
                <DropdownMenuItem>Blog</DropdownMenuItem>
              </Link>
              <Link href={`/user/${user.username}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
