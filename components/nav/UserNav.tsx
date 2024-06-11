"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

import {Notification, User} from "@prisma/client";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Bell, Mail, MailWarning} from "lucide-react";
import {signOut} from "next-auth/react";
import Link from "next/link";

type UserProps = {
  user: User | null;
};

export function UserNav({user}: UserProps) {
  const {mutate: markAsRead, isPending} = useMutation({
    mutationFn: async (id: number) => {
      await axios.patch(`/api/user/notifications/${id}`);
    },
  });

  const {data: notifications} = useQuery({
    queryKey: ["notifications", isPending],
    queryFn: () => getNotifications(),
  });

  const getNotifications = async () => {
    const {data} = await axios.get<Notification[]>("/api/user/notifications");
    return data;
  };

  const unreadNotifications = notifications?.filter((f) => !f.isRead);

  const handleNotificationClick = async (id: number) => {
    const noti = notifications?.find((f) => f.id === id);
    if (noti && noti.isRead) {
      return null;
    }
    await markAsRead(id);
  };

  return (
    <DropdownMenu>
      {user ? (
        <>
          <Popover>
            <PopoverTrigger>
              <div className="pt-2 px-2">
                <strong className="relative inline-flex items-center ">
                  <span className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-gray-200 flex justify-center items-center">
                    <span>{unreadNotifications?.length}</span>
                  </span>
                  <Bell className="w-5 h-5" />
                </strong>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                {notifications?.length ? (
                  notifications.map((notif) => (
                    <Link href={notif.herf || ""} key={notif.id}>
                      <div
                        className={`p-2 border-b border-gray-200 text-sm ${notif.isRead ? "text-gray-500" : "text-black"}`}
                        onClick={() => handleNotificationClick(notif.id)}
                      >
                        {notif.message}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-2">No notifications</p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </>
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
