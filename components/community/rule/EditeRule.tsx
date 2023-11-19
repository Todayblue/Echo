"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  RuleUpdationRequest,
  UpdateRuleValidator,
} from "@/lib/validators/rule";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

type editeRuleProps = {
  community: {
    id: string;
    slug: string | null;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    creatorId: string;
  };
  rule: {
    id: string;
    title: string;
    description: string;
    authorId: string;
    communityId: string;
  };
};

export const UpdateRule = ({ community, rule }: editeRuleProps) => {
  const router = useRouter();

  const form = useForm<RuleUpdationRequest>({
    resolver: zodResolver(UpdateRuleValidator),
    defaultValues: {
      title: rule.title,
      description: rule.description,
    },
  });

  const editCommunityRule = async (payload: RuleUpdationRequest) => {
    const { data } = await axios.patch(
      `/api/communities/${community.slug}/rules/${rule.id}`,
      payload
    );
    return data;
  };

  const { mutate: editeRule, isPending } = useMutation({
    mutationFn: (values: RuleUpdationRequest) => editCommunityRule(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: "Could not Update rules.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "The rule has been successfully updated. 🚀",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${community.slug}`);
        router.refresh();
      }, 1000);
    },
  });

  const onSubmit = (data: RuleUpdationRequest) => {
    console.log("Form submitted with data:", data);
    editeRule(data);
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
              <CardTitle>{community.name}/Rules</CardTitle>
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
              Update Rules
            </Button>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};
