"use client";
import React, {useEffect} from "react";
import {Community, Role} from "@prisma/client";
import {useState} from "react";

import {useForm} from "react-hook-form";

import {useRouter} from "next-nprogress-bar";

// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

// hooks
import {useCustomToasts} from "@/hooks/use-custom-toasts";
import {useToast} from "@/hooks/use-toast";

// validator and types
import {zodResolver} from "@hookform/resolvers/zod";

// api
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {FileImage} from "lucide-react";

import {
  CommunityValidator,
  CreateCommunityPayload,
} from "@/lib/validators/community";
import {generateSlug} from "@/lib/slugtify";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
import {Button} from "../ui/button";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

type Props = {
  defaultValues?: Community;
};

const CommunityForm = ({defaultValues}: Props) => {
  const {data: session} = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const {toast} = useToast();
  const [fileURL, setFileURL] = useState<string>(
    defaultValues?.profileImage || ""
  );
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();

  const form = useForm<CreateCommunityPayload>({
    resolver: zodResolver(CommunityValidator),
    defaultValues: {
      id: defaultValues?.id,
      description: defaultValues?.description || "",
      name: defaultValues?.name,
      profileImage: defaultValues?.profileImage || "",
      isActive: defaultValues?.isActive || false,
      title: defaultValues?.title || "",
    },
  });

  const createCommunity = async (payload: CreateCommunityPayload) => {
    const profileImage = await handleImageSubmit();
    const payloadWithImage = {...payload, profileImage};
    const {data} = await axios.post("/api/community/", payloadWithImage);

    return data;
  };

  const updateCommunity = async (payload: CreateCommunityPayload) => {
    const profileImage = await handleImageSubmit();

    const updatedPayload = {
      ...payload,
      profileImage:
        profileImage == undefined ? payload.profileImage : profileImage,
    };

    const {data} = await axios.patch(
      `/api/community/${defaultValues?.slug}`,
      updatedPayload
    );

    return data;
  };

  const {mutate: CommunityCreate, isPending} = useMutation({
    mutationFn: async (values: CreateCommunityPayload) =>
      createCommunity(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: `${err}`,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        duration: 2000,
      });
      setTimeout(() => {
        const url =
          session?.user.role !== Role.ADMIN ? `/` : `/admin/community`;
        router.push(url);
        router.refresh();
      }, 1000);
    },
  });

  const {mutate: UpdateCommunity, isPending: isPendingUpdate} = useMutation({
    mutationFn: async (values: CreateCommunityPayload) =>
      updateCommunity(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: `${err}`,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/admin/community`);
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

    const {results} = await response.json();

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
      form.setValue("profileImage", fileURL || "");
      form.clearErrors("profileImage");
    }
  };

  const onSubmit = async (data: CreateCommunityPayload) => {
    if (pathname.includes("edit")) {
      await UpdateCommunity(data);
    } else {
      await CommunityCreate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="py-8">
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
          <Label>Image</Label>
          <FormField
            control={form.control}
            name="profileImage"
            render={({field}) => (
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
        </div>
        <div className="md:grid md:grid-cols-2 gap-8 ">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Community name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Community title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Community description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({field}) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={session?.user.role !== Role.ADMIN}
                    />
                    <Label>{field.value ? "Active" : "Inactive"}</Label>
                    {session?.user.role !== Role.ADMIN && (
                      <Label>You need approve from admin</Label>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between space-x-2 py-10">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          {pathname.includes("edit") ? (
            <Button isLoading={isPendingUpdate} type="submit">
              Save
            </Button>
          ) : (
            <Button isLoading={isPending} type="submit">
              Create
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CommunityForm;
