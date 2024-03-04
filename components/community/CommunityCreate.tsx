"use client";
import React from "react";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// hooks
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";

// validator and types
import { zodResolver } from "@hookform/resolvers/zod";
// import { ICommunity } from "@/types/db";

// api
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import {
  CommunityValidator,
  CreateCommunityPayload,
} from "@/lib/validators/community";
import { generateSlug } from "@/lib/slugtify";

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

const CommunityCreate = () => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [fileURL, setFileURL] = useState<string>();
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();

  const form = useForm<CreateCommunityPayload>({
    resolver: zodResolver(CommunityValidator),
  });

  const createCommunity = async (payload: CreateCommunityPayload) => {
    const profileImage = await handleImageSubmit();
    const payloadWithImage = { ...payload, profileImage };
    const { data } = await axios.post("/api/community/", payloadWithImage);

    return data;
  };

  const { mutate: CommunityCreate, isPending } = useMutation({
    mutationFn: async (values: CreateCommunityPayload) =>
      createCommunity(values),
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
      toast({
        title: "Created Community Successfully",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${generateSlug(data)}`);
        router.refresh();
      }, 1000);
    },
  });

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
    toast({
      title: "Created Community Successfully",
      variant: "success",
      duration: 2000,
    });
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      setFile(uploadedFile);
      setFileURL(URL.createObjectURL(uploadedFile));
      form.setValue("profileImage", fileURL || "");
      form.clearErrors("profileImage");
    }
  };

  const onSubmit = async (data: CreateCommunityPayload) => {
    await CommunityCreate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="grid mx-auto w-2/5">
          <div className="grid gap-6 pt-5 ">
            <div className="grid p-4 border-b border-gray-300">
              <h1 className="font-bold text-xl ">Create a Community</h1>
            </div>
            <div className="grid gap-y-4">
              <div className="grid gap-2">
                <label
                  htmlFor="coverImage"
                  className="grid gap-y-3 col-span-1  "
                >
                  <div className="grid place-items-center">
                    <Avatar className="w-24 h-24 ">
                      {fileURL ? (
                        <AvatarImage src={fileURL}></AvatarImage>
                      ) : (
                        <AvatarFallback>
                          <FileImage />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <Label>Community Image</Label>
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            name="coverImage"
                            type="file"
                            onChange={onImageUpload}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </label>
              </div>
              <div className="grid gap-2">
                <Label>Community names</Label>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="pl-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>Community title.</Label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} className="pl-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>Community description.</Label>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="pl-6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default CommunityCreate;
