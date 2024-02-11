"use client";
import { useMemo } from "react";
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
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";

type UserProps = {
  user: User | null;
};

export function UserNav({ user }: UserProps) {
  const userName = user?.username || user?.name || "";

  const avatar = useMemo(() => {
    return createAvatar(botttsNeutral, {
      backgroundColor: ["43a047", "00acc1", "3949ab", "d81b60"],
      seed: userName,
      size: 128,
      eyes: ["bulging", "dizzy", "eva", "glow", "frame2", "frame1", "happy"],
      mouth: [
        "bite",
        "diagram",
        "grill01",
        "grill02",
        "grill03",
        "smile01",
        "smile02",
        "square01",
        "square02",
      ],
      // ... other options
    }).toDataUriSync();
  }, [userName]);

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
              <AvatarImage src={user.image || avatar} />
              <AvatarFallback>{userName}</AvatarFallback>
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
                <p className="text-sm font-medium leading-none">{userName}</p>
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
              <Link href="/feed">
                <DropdownMenuItem>Your Feed</DropdownMenuItem>
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
