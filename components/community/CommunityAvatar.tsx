import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  profileImage?: string;
  communityName: string;
  className?: string | undefined;
}

const CommunityAvatar = ({ profileImage, communityName, className }: Props) => {
  return (
    <div className={className}>
      <Avatar className="w-full h-full ring-4 ring-white">
        <AvatarImage src={profileImage} alt="commu avatar" />
        <AvatarFallback>{communityName}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CommunityAvatar;
