import Image from "next/image";

import { cn } from "@/lib/utils";

import { ContextMenu, ContextMenuTrigger } from "./ui/context-menu";
import Link from "next/link";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  profileImage: string | null;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  communitySlug: string | null;
}

export function AlbumArtwork({
  name,
  profileImage,
  aspectRatio = "portrait",
  width,
  height,
  className,
  communitySlug,
  ...props
}: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3 py-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Link href={`community/${communitySlug}`}>
              <Image
                src={profileImage || ""}
                alt={name}
                width={width}
                height={height}
                className={cn(
                  "object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            </Link>
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-extrabold text-gray-800 leading-none text-center capitalize">
          {name}
        </h3>
      </div>
    </div>
  );
}
