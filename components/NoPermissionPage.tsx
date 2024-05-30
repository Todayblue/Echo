"use client";
import React from "react";
import {Button} from "./ui/button";
import {useRouter} from "next-nprogress-bar";

const NoPermissionPage = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">
          <span role="img" aria-label="Sad Face">
            ☹️
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          You do not have permission to view the content
        </h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
};

export default NoPermissionPage;
