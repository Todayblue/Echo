"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { ICommunity } from "@/types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { Option } from "react-tailwindcss-select/dist/components/type";

const getCommunityBySlug = async (slug: string) => {
  const { data } = await axios.get(`/api/subcommunity/${slug}`);
  return data.community;
};

const getCommunities = async () => {
  const { data } = await axios.get("/api/subcommunity/");

  return data;
};

type CommunitiesQuery = {
  id: string;
  name: string;
  slug: string;
};

const Page = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const { data: session } = useSession();

  const form = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
  });

  const { data: community, isLoading } = useQuery({
    queryKey: ["community", slug],
    queryFn: () => getCommunityBySlug(slug),
  });

  // const getCommunityDefaults = (community: ICommunity): Option => ({
  //   value: community.id,
  //   label: community.name,
  // });

  const getCommunityDefaults = (community: ICommunity) => {
    if (community) {
      const CommuOption = {
        value: community.id,
        label: community.name,
      };
      return CommuOption;
    }
    return null;
  };

  const [topic, setTopic] = useState<Option | null>(null);
  // console.log("topic:", topic);

  useEffect(() => {
    session && form.setValue("authorId", session.user.id);

    const communityDefaults = getCommunityDefaults(community);
    // console.log("communityDefaults", communityDefaults);

    setTopic(communityDefaults);
    communityDefaults &&
      form.setValue("subCommunityId", communityDefaults.value);
  }, [community, form, session]);

  const { data: communities } = useQuery<CommunitiesQuery[]>({
    queryKey: ["communities"],
    queryFn: getCommunities,
  });

  if (!communities) {
    return null;
  }

  const options: Option[] = communities.map((community: CommunitiesQuery) => ({
    value: community.id.toString(),
    label: community.name,
  }));

  const handleSelectChange = (selectOptions: any) => {
    setTopic(selectOptions);

    if (selectOptions) {
      form.setValue("subCommunityId", selectOptions.value);
    }
  };

  const onSubmit = (data: PostCreationRequest) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <div className=" bg-white rounded-lg">
      <CardHeader className="font-semibold border-b border-gray-300">
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <Select
        primaryColor={"blue"}
        value={topic}
        onChange={handleSelectChange}
        options={options}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <div className="mx-auto px-4 ">
            <div className="grid gap-6 pt-5">
              <div className="grid gap-2">
                <Label htmlFor="security-level">Community</Label>
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
              <Button type="submit">Create Post</Button>
            </CardFooter>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
