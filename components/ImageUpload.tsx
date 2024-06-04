"use client";
import React, {useRef, useState} from "react";
import {Button} from "@/components/ui/button";

type ImageUploadProps = {
  onUpload: (file: File) => void;
  currentImage?: string;
  onSubmit: (file: File) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  currentImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      onUpload(uploadedFile);
      setFile(uploadedFile);
    }
  };

  return (
    <div style={{position: "relative", display: "inline-block"}}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{display: "none"}}
      />
      <img
        src={currentImage || ""}
        alt="User Profile"
        className="object-cover object-top w-full cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
};

export default ImageUpload;
