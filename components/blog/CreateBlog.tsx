"use client";
import React, { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

// components
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Editor from "@/components/editor/Editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Select from "react-tailwindcss-select";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

// hooks
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";

// validator and types
import { zodResolver } from "@hookform/resolvers/zod";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
// import { ICommunity } from "@/types/db";
import { Option } from "react-tailwindcss-select/dist/components/type";

// api
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
// import CreateCommunityPost from "@/components/community/post/CreateCommunityPost";

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

type CreateCommunityPostProps = {
  community: {
    id: string;
    slug: string | null;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    creatorId: string;
  };
  communities: {
    id: string;
    slug: string | null;
    name: string;
  }[];
};

type CommunityDefaultType = {
  id: string;
  slug: string | null;
  name: string;
};

type Props = {};

const CreateBlog = (props: Props) => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [communitySelect, setCommunitySelect] = useState<Option | null>(null);
  const [fileURL, setFileURL] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();

  const form = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
  });

  const createSubCommuPost = async (payload: PostCreationRequest) => {
    const imageUrl = await handleImageSubmit();
    const payloadWithImage = { ...payload, imageUrl };
    const { data } = await axios.post(
      "/api/community/post/create",
      payloadWithImage
    );

    return data;
  };

  const { mutate: createCommunityPost, isPending } = useMutation({
    mutationFn: async (values: PostCreationRequest) =>
      createSubCommuPost(values),
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          return toast({
            title: "You are not subscribed to this community",
            description: "Please subscribe to Community.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid community name.",
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create sub community.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("data", data);
      toast({
        title: "Created post successfully 🚀",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        //  router.push(`/community/${community.slug}`);
        router.refresh();
      }, 1000);
    },
  });

  const handleSelectChange = (selectOptions: Option | Option[] | null) => {
    // Assuming setCommunitySelect is a state-setting function
    setCommunitySelect((prevValue) => {
      // You may want to adjust this logic based on your requirements
      if (Array.isArray(selectOptions)) {
        // Handle the case when selectOptions is an array (Option[])
        return selectOptions[0]; // or selectOptions[0]?.value if you want the value property
      } else {
        // Handle the case when selectOptions is a single option or null
        return selectOptions;
      }
    });

    if (selectOptions) {
      form.setValue(
        "communityId",
        Array.isArray(selectOptions)
          ? selectOptions[0].value
          : selectOptions.value
      );
    }
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

    const { results } = await response.json();

    setSneakers((prev) => {
      if (!prev) return [results];
      return [results, ...prev];
    });
    return results.url;
  }

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      setFile(uploadedFile);
      setFileURL(URL.createObjectURL(uploadedFile));
    }
  };

  const onSubmit = async (data: PostCreationRequest) => {
    await createCommunityPost(data);
  };
  return (
    <Form {...form}>
      <form className="space-y-8 ">
        <div className="grid  w-2/4 mx-auto px-4 ">
          <div className="grid gap-6 pt-5">
            <div className="grid gap-2">
              <Label>Title</Label>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Add a Title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tag</Label>
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* <Select
                        {...field}
                        isClearable
                        isSearchable
                        primaryColor={"blue"}
                        value={communitySelect}
                        onChange={handleSelectChange}
                        options={options}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <label
                htmlFor="cover-image"
                className="block text-sm font-medium text-gray-900"
              >
                Cover Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="coverImage"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      {fileURL ? (
                        <div>
                          <Image
                            src={fileURL}
                            alt="Preview"
                            width={544}
                            height={306}
                          />
                        </div>
                      ) : (
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <input
                        id="coverImage"
                        name="coverImage"
                        type="file"
                        className="sr-only"
                        onChange={onImageUpload}
                      />
                      <span>Upload a file</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Content </Label>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <CardFooter className="justify-between space-x-2 py-10">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Post</Button>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};

export default CreateBlog;
