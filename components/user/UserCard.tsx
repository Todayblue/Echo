"use client";
import React, {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import {enUS} from "date-fns/locale";
import {Cake, ImageUp} from "lucide-react";
import Link from "next/link";
import {Community, User} from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "../ui/input";
import ImageUpload from "../ImageUpload";
import axios from "axios";
import { UpdateUserPayload } from "@/lib/validators/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Props = {
  user: User;
  userCommunity: Community[];
};

type CloudinaryResource = {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

const UserCard = ({user, userCommunity}: Props) => {
  const [fileURL, setFileURL] = useState<string>();
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();
  const [showSubmitButton, setShowSubmitButton] = useState(false); // Initially show the submit button

  const handleSubmit = async (model: UpdateUserPayload) => {
    const imageUrl = await handleImageSubmit()
    model.image = imageUrl
    const res = await axios.patch(`/api/user/${user.id}`, model);

    if (file) {
      setShowSubmitButton(false); // Hide the submit button after submitting the image
    }
    return res.data

  };

  const {mutate: updateUserImage, isPending} = useMutation({
    mutationFn: async (values: UpdateUserPayload) => handleSubmit(values),
    onSuccess: (data) => {
      toast({
        title: "",
        variant: "success",
        duration: 2000,
      });
    },
  });

  const handleImageUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setFileURL(URL.createObjectURL(uploadedFile));
    setShowSubmitButton(true); // Show the submit button when a new image is selected
  };

  async function handleImageSubmit() {
    // e.preventDefault();

    if (typeof file === "undefined") return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const {results} = await response.json();

    setSneakers((prev) => {
      if (!prev) return [results];
      return [results, ...prev];
    });
    return results.url;
  }

  const handleSubmitImage = async () => {
    let model = {}
    await updateUserImage(model);
  }

  const userCommunityFirst = userCommunity.slice(0, 2);
  const userCommunityLast = userCommunity.slice(2);

  return (
    <div className="col-span-2">
      <div className="max-w-2xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
        <div className="rounded-t-lg overflow-hidden">
          <div className="bg-sky-500 h-32"></div>
        </div>
        <div className="relative -mt-16">
          <div className="ml-4 w-24 h-24 border-4 border-white rounded-sm overflow-hidden">
            <div className="relative w-full h-full">
              <ImageUpload
                onUpload={handleImageUpload}
                onSubmit={handleImageSubmit}
                currentImage={fileURL || user?.image || ""}
              />
              <ImageUp color="black" className="absolute bottom-0 right-0" />
            </div>
            {showSubmitButton && (
              <Button
                variant="outline"
                className="absolute bottom-0 right-0 m-2"
                onClick={handleSubmitImage}
                isLoading={isPending}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
        <div className="ml-4">
          <h1 className="text-gray-900 text-xl font-semibold capitalize">
            {user?.name}
          </h1>
          <h2 className="text-gray-800 text-lg font-semibold">
            u/{user?.username}
          </h2>
        </div>
        <p className="text-gray-700 mx-4 pt-2">{user?.bio}</p>
        <ul className="flex flex-row mx-4 py-4">
          <li className="flex flex-col mr-4">
            <p className="text-gray-800 font-bold">Community</p>
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {userCommunityFirst.map((com) => (
                <div key={com.id}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`/community/${com.slug}`}>
                          <img
                            className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                            src={com.profileImage || ""}
                            alt={com.name}
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white">
                        <p>{com.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
              <Dialog>
                <DialogTrigger className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">
                  {userCommunityLast.length}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Communities</DialogTitle>
                    <DialogDescription>
                      List of other communities you have joined.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {userCommunityLast.map((community) => (
                      <div
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                        key={community.id}
                      >
                        <div className="flex items-center">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={community.profileImage || ""}
                            alt={community.name}
                          />
                          <div className="ml-4">
                            <p className="text-sm font-semibold">
                              {community.name}
                            </p>
                            <p className="text-xs text-gray-500 w-5/6">
                              {community.description}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/community/${community.slug}`}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </li>
          <li className="flex flex-col mx-auto">
            <p className="text-gray-800 font-bold">Cake Day</p>
            <div className="flex space-x-1 justify-center items-center py-1">
              <Cake className="text-primary" />
              <p className="text-gray-700 font-medium">
                {user?.dateOfBirth &&
                  format(new Date(user.dateOfBirth), "MMM d, yyyy", {
                    locale: enUS,
                  })}
              </p>
            </div>
          </li>
        </ul>
        <div className="p-4 border-t mx-8 mt-2 ">
          <Link href={`/user/${user.username}/settings`}>
            <Button variant={"outline"} className="w-full">
              Setting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
