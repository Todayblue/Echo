import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CommuAvatar = () => {
  return (
    <div className="w-20 h-20">
      <Avatar className="w-full h-full ring-4 ring-white">
        <AvatarImage
          src="https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=60&w=600&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FydG9vbiUyMGNoYXJhY3RlcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="commu avatar"
          className=""
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CommuAvatar;
