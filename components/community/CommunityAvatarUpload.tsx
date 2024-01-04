"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Upload } from "lucide-react";

type Props = {};

const CommunityAvatarUpload = (props: Props) => {
  const [fileURL, setFileURL] = useState<string | undefined>();

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      setFileURL(URL.createObjectURL(uploadedFile));
    }
  };

  return (
    <div className="w-20 h-20">
      <Avatar className="w-full h-full ring-4 ring-white relative overflow-hidden">
        <label
          htmlFor="coverImage"
          className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
        >
          {fileURL ? (
            <div>
              <AvatarImage src={fileURL} />
            </div>
          ) : (
            <AvatarFallback className="absolute inset-0 flex items-center justify-center w-full h-full text-center">
              <Upload />
            </AvatarFallback>
          )}
          <input
            id="coverImage"
            name="coverImage"
            type="file"
            className="sr-only"
            onChange={onImageUpload}
          />
        </label>
      </Avatar>
    </div>
  );
};

export default CommunityAvatarUpload;
