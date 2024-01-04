import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  profileImage?: string;
  communityName: string;
}

const CommunityAvatar = ({ profileImage, communityName }: Props) => {
  return (
    <div className="w-20 h-20">
      <Avatar className="w-full h-full ring-4 ring-white">
        <AvatarImage src={profileImage} alt="commu avatar" className="" />
        <AvatarFallback>{communityName}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CommunityAvatar;
