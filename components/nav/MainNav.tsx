import Link from "next/link";
import { cn } from "@/lib/utils";
import { PenSquare } from "lucide-react";
import { BookText } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 text-sm font-medium transition-colors",
        className
      )}
      {...props}
    >
      <Link href="post/create">
        <PenSquare className="w-6 h-6" />
      </Link>
      <Link href="/blogs">
        <BookText className="w-6 h-6" />
      </Link>
    </nav>
  );
}
