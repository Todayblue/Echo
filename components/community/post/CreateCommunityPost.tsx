"use client";
import React from "react";
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

type Props = {};

const createSubCommuPost = async (payload: PostCreationRequest) => {
  const { data } = await axios.post("/api/communities/post/create", payload);

  return data;
};

const getCommunityBySlug = async (slug: string) => {
  const { data } = await axios.get(`/api/communities/${slug}`);
  return data.community;
};

const getCommunities = async () => {
  const { data } = await axios.get("/api/communities/");

  return data;
};

type CommunitiesQuery = {
  id: string;
  name: string;
  slug: string;
};

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

const getCommunityDefaults = (community: CommunityDefaultType) => {
  const communityDefaults = {
    value: community.id,
    label: community.name,
  };
  return communityDefaults;
};

const CreateCommunityPost = ({
  community,
  communities,
}: CreateCommunityPostProps) => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [communitySelect, setCommunitySelect] = useState<Option | null>(null);

  const form = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId: community.id,
    },
  });

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
      toast({
        title: "Created post successfully 🚀",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${community.slug}`);
        router.refresh();
      }, 1000);
    },
  });

  useEffect(() => {
    const communityDefaults: Option = getCommunityDefaults(community);

    if (communityDefaults) {
      setCommunitySelect(communityDefaults);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [community, form]);

  const options: Option[] = communities.map((community) => ({
    value: community.id.toString(),
    label: community.name,
  }));

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

  const onSubmit = (data: PostCreationRequest) => {
    console.log("Form submitted with data:", data);
    createCommunityPost(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="mx-auto px-4 ">
          <div className="grid gap-6 pt-5">
            <div className="grid gap-2">
              <Label>Community</Label>
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        {...field}
                        isClearable
                        isSearchable
                        primaryColor={"blue"}
                        value={communitySelect}
                        onChange={handleSelectChange}
                        options={options}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              <Label>Text </Label>
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

export default CreateCommunityPost;
