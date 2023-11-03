"use client";
import { useForm, useFormState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import router from "next/navigation";
import { RuleValidator, RuleCreationRequest } from "@/lib/validators/rule";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import prisma from "@/lib/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import {
  CommunityCreationRequest,
  CommunityValidator,
} from "@/lib/validators/community";

const getCommunityBySlug = async (slug: string) => {
  const { data } = await axios.get(`/api/subcommunity/${slug}`);

  return data.community;
};

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { loginToast } = useCustomToasts();

  const { data: community, isLoading } = useQuery<CommunityCreationRequest>({
    queryKey: ["community", slug],
    queryFn: () => getCommunityBySlug(slug),
  });

  const form = useForm<RuleCreationRequest>({
    resolver: zodResolver(RuleValidator),
    defaultValues: {
      title: "",
      description: "",
      subCommunityId: community?.id,
    },
  });

  const createSubCommuRule = async (payload: RuleCreationRequest) => {
    const { data } = await axios.post(
      `/api/subcommunity/${slug}/rule`,
      payload
    );

    return data;
  };

  const { mutate: createRule, isPending } = useMutation({
    mutationFn: (values: RuleCreationRequest) => createSubCommuRule(values),
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          return toast({
            title: "You are not subscribed to this community",
            description: "Please subscribe to sub community.",
            variant: "destructive",
          });
        }

        // if (err.response?.status === 401) {
        //   return loginToast();
        // }
      }

      toast({
        title: "There was an error.",
        description: "Could not create rules.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("data", data);
      toast({
        title: "Create post",
        description: "Created Rules successfully 📣",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${slug}`);
        router.refresh();
      }, 1000);
    },
  });

  const onSubmit = (data: RuleCreationRequest) => {
    console.log("Form submitted with data:", data);
    createRule(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-white rounded-lg"
      >
        <div className="mx-auto px-4 ">
          <div className="grid gap-6 pt-5">
            <CardHeader className="capitalize ">
              <CardTitle>Create </CardTitle>
              <CardTitle>{community?.name}/Rules</CardTitle>
            </CardHeader>
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
              <Label>Description</Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Add a Description..." {...field} />
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
              Create Rules
            </Button>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
}
