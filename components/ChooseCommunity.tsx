import React from "react";
import { Separator } from "./ui/separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import prisma from "@/lib/prisma";
import { AlbumArtwork } from "./AlbumArtwork";

type Props = {};

const ChooseCommunity = async (prop: Props) => {
  const communities = await prisma.community.findMany();

  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Choose Community
        </h2>
        <p className="text-sm text-muted-foreground">
          Your personal playlists. Updated daily.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea className="h-[370px] rounded-md border p-4">
          {/* Create columns */}

          <div className="grid grid-cols-4 place-items-center mx-2">
            {/* Display up to 4 albums in each column */}
            {communities.map((community) => (
              <AlbumArtwork
                key={community.id}
                name={community.name}
                communitySlug={community.slug}
                profileImage={community.profileImage}
                aspectRatio="square"
                width={120}
                height={120}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ChooseCommunity;
