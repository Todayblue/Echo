"use client";

import React, {useEffect, useState} from "react";

import Link from "next/link";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {Select} from "@/components/ui/select";
import {useFieldArray, useForm} from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {User} from "@prisma/client";
import {UpdateUserPayload, UpdateUserValidator} from "@/lib/validators/user";
import {Calendar} from "@/components/ui/calendar";
import {CalendarIcon} from "lucide-react";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

type ProfileProps = {
  user: User;
};

export function ProfileForm({user}: ProfileProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date>();

  const form = useForm<UpdateUserPayload>({
    resolver: zodResolver(UpdateUserValidator),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth : undefined,
    },
  });

  const updateUser = async (payload: UpdateUserPayload) => {
    const {data} = await axios.patch(`/api/user/${user.id}`, payload);
    return data;
  };

  const {mutate: updateUserMutate, isPending} = useMutation({
    mutationFn: async (values: UpdateUserPayload) => updateUser(values),
    onSuccess: (data) => {
      toast({
        title: "Created Community Successfully",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/user/${data.username}`);
        router.refresh();
      }, 1000);
    },
  });

  useEffect(() => {
    const dateOfBirth = form.getValues("dateOfBirth");
    if (dateOfBirth != null && dateOfBirth !== undefined) {
      setDate(dateOfBirth);
    }
  }, [form]);

  useEffect(() => {
    form.setValue("dateOfBirth", date);
  }, [date, form]);

  const onSubmit = async (data: UpdateUserPayload) => {
    await updateUserMutate(data);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="mx-6">
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 mx-6">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile
                      and in emails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name
                      or a pseudonym. You can only change this once every 30
                      days.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can <span>@mention</span> other users and
                      organizations to link to them.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-2">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={date}
                          onSelect={setDate}
                          fromYear={1980}
                          toYear={2025}
                          {...field}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" isLoading={isPending}>
                Update profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
