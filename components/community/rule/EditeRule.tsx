"use client";
import React from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next-nprogress-bar";
import {useMutation} from "@tanstack/react-query";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {RuleUpdationRequest, UpdateRuleValidator} from "@/lib/validators/rule";
import {Textarea} from "@/components/ui/textarea";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";

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

export const UpdateRule = ({community, rule}: editeRuleProps) => {
  const router = useRouter();

  const form = useForm<RuleUpdationRequest>({
    resolver: zodResolver(UpdateRuleValidator),
    defaultValues: {
      title: rule.title,
      description: rule.description,
    },
  });

  const editCommunityRule = async (payload: RuleUpdationRequest) => {
    const {data} = await axios.patch(
      `/api/community/${community.slug}/rules/${rule.id}`,
      payload
    );
    return data;
  };

  const {mutate: editeRule, isPending} = useMutation({
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
        title: "success",
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto px-4">
          <CardContent className="grid gap-4">
            <CardHeader className="px-0">
              <CardTitle>Edit Rule</CardTitle>
            </CardHeader>
            <hr className="pt-4 border-gray-300 " />
            <FormLabel>Title</FormLabel>
            <FormField
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Add a Title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Description</FormLabel>
            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="h-32"
                      placeholder="Add a Description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant={"outline"} onClick={() => router.back()}>
              Cancel
            </Button>
            <Button isLoading={isPending} type="submit">
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
