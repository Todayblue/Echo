"use client";
import React from "react";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next-nprogress-bar";
import {useMutation} from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {RuleCreationRequest, RuleValidator} from "@/lib/validators/rule";
import {Textarea} from "@/components/ui/textarea";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/hooks/use-toast";

type CreateRuleProps = {
  community: {
    id: string;
    slug: string | null;
    name: string;
    title: string | null;
  };
};

export const CreateRule = ({community}: CreateRuleProps) => {
  const router = useRouter();

  const form = useForm<RuleCreationRequest>({
    resolver: zodResolver(RuleValidator),
    defaultValues: {
      communityId: community.id,
    },
  });

  const createCommunityRule = async (payload: RuleCreationRequest) => {
    const {data} = await axios.post(
      `/api/community/${community.slug}/rules`,
      payload
    );
    return data;
  };

  const {mutate: createRule, isPending} = useMutation({
    mutationFn: (values: RuleCreationRequest) => createCommunityRule(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: "Could not create rules.",
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

  const onSubmit = (data: RuleCreationRequest) => {
    console.log("Form submitted with data:", data);
    createRule(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto px-4 ">
          <CardContent className="grid gap-4">
            <CardHeader className="px-0">
              <CardTitle>Create Rule</CardTitle>
            </CardHeader>
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
              Create
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
