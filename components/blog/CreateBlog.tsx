"use client";
import React, { SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { MultiValue, ActionMeta, OnChangeValue } from "react-select";
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
import CreatableSelect from "react-select/creatable";

// hooks
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";

// validator and types
import { zodResolver } from "@hookform/resolvers/zod";
// import { ICommunity } from "@/types/db";

// api
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { TagPayload } from "@/lib/validators/blog/tag";
import { BlogPayload, BlogValidator } from "@/lib/validators/blog/blog";
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

type Props = {
  blogTags: {
    id: number;
    slug: string | null;
    name: string;
    authorId: string;
  }[];
};
type Option = {
  label: string;
  value: string;
};

const CreateBlog = ({ blogTags }: Props) => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [communitySelect, setCommunitySelect] = useState<Option | null>(null);
  const [fileURL, setFileURL] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();
  const [selectValue, setSelectValue] = useState<Option[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BlogPayload>({
    resolver: zodResolver(BlogValidator),
  });

  const createSubCommuPost = async (payload: BlogPayload) => {
    const imageUrl = await handleImageSubmit();
    const payloadWithImage = { ...payload, imageUrl };
    const { data } = await axios.post(
      "/api/community/post/create",
      payloadWithImage
    );

    return data;
  };

  const options: Option[] = blogTags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
    __isNew__: false,
  }));

  const handleTagData = () => {
    selectValue?.forEach((option: any) => {
      if (option.__isNew__) {
        createTag(option);
      }
    });
  };

  const createBlogPost = async (payload: BlogPayload) => {
    const imageUrl = await handleImageSubmit();
    payload.coverImage = imageUrl;
    // await createTag();
    handleTagData();
    const { data } = await axios.post("/api/blog", payload);

    return data;
  };

  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: async (values: BlogPayload) => createBlogPost(values),
  });

  const { mutate: createTag } = useMutation({
    mutationFn: async (option: any) => {
      const payload: TagPayload = {
        name: option.label,
      };
      const { data } = await axios.post("/api/blog/tag", payload);
      return data;
    },
  });

  const handleSelectChange = (selectOptions: any) => {
    setSelectValue(selectOptions);
    selectOptions.forEach((option: any) => {
      if (option.__isNew__) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    });
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
      form.setValue("coverImage", "");
      setFile(uploadedFile);
      setFileURL(URL.createObjectURL(uploadedFile));
    }
  };

  const onSubmit = async (data: BlogPayload) => {
    console.log("data", data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
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
              <CreatableSelect
                isClearable
                isMulti
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={handleSelectChange}
                options={options}
                value={selectValue}
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
                            width={426}
                            height={240}
                          />
                        </div>
                      ) : (
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                className="sr-only"
                                onChange={onImageUpload}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
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
            <Button isLoading={isPending} type="submit">
              Create Post
            </Button>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};

export default CreateBlog;
