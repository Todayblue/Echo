import Image from "next/image";
import Link from "next/link";

import {cn} from "@/lib/utils";

import {ContextMenu, ContextMenuTrigger} from "./ui/context-menu";

interface CommuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  profileImage: string | null;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  communitySlug: string | null;
}

export function CommuCard({
  name,
  profileImage,
  aspectRatio = "portrait",
  width,
  height,
  className,
  communitySlug,
  ...props
}: CommuCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-2 py-3 w-full",
        className
      )}
      {...props}
    >
      <div
        className="overflow-hidden rounded-md w-full"
        style={{width, height}}
      >
        <Link href={`community/${communitySlug}`}>
          <Image
            src={profileImage || ""}
            alt={name}
            width={width}
            height={height}
            className={cn(
              "object-cover transition-all hover:scale-105 w-full h-full",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </Link>
      </div>
      <h3 className="text-xs text-gray-600 truncate w-full text-center">
        {name}
      </h3>
    </div>
  );
}
