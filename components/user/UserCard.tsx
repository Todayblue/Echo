"use client";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import {enUS} from "date-fns/locale";
import {Cake, ImageUp} from "lucide-react";
import Link from "next/link";
import {Community, User} from "@prisma/client";
import ImageUpload from "../ImageUpload";
import axios from "axios";
import {UpdateUserPayload} from "@/lib/validators/user";
import {useMutation} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next-nprogress-bar";

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
};

const UserCard = ({user, userCommunity}: Props) => {
  const [fileURL, setFileURL] = useState<string>();
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();
  const [showSubmitButton, setShowSubmitButton] = useState(false); // Initially show the submit button
  const router = useRouter();

  const handleSubmit = async (model: UpdateUserPayload) => {
    const imageUrl = await handleImageSubmit();
    model.image = imageUrl;
    const res = await axios.patch(`/api/user/${user.id}`, model);

    if (file) {
      setShowSubmitButton(false); // Hide the submit button after submitting the image
    }
    return res.data;
  };

  const {mutate: updateUserImage, isPending} = useMutation({
    mutationFn: async (values: UpdateUserPayload) => handleSubmit(values),
    onSuccess: (data) => {
      toast({
        title: "Success",
        duration: 2000,
      });
      setTimeout(() => {
        router.refresh();
      }, 1000);
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
    let model = {};
    await updateUserImage(model);
  };

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
        {user.dateOfBirth && (
          <>
            <ul className="flex flex-row mx-4 py-4">
              <li className="flex flex-col ">
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
          </>
        )}
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
