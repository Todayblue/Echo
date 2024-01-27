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
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

type UserProps = {
  user: {
    name: string;
    email: string;
    image: string;
  };
};

type UserName = {
  firstName: string;
  lastName: string;
};

const splitName = (name = "") => {
  const [firstName, ...lastName] = name.split(" ");
  const fName = firstName.split("");
  const lName = lastName.join(" ").split("");
  return {
    firstName: fName[0],
    lastName: lName[0],
  };
};

export function UserNav({ user }: UserProps) {
  if (!user) {
    return (
      <Button variant="outline" onClick={() => signIn("google")}>
        Sign in
      </Button>
    );
  }

  const userName: UserName = splitName(user.name);

  return (
    <DropdownMenu>
      {user && (
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image} alt="@shadcn" />
              <AvatarFallback>{`${userName.firstName} ${userName.lastName}`}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          {user && (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/feed'>
            <DropdownMenuItem>Your Feed</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
