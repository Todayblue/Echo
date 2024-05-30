"use client";
import React, {useEffect} from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";

import {usePathname, useRouter} from "next/navigation";

// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Editor from "@/components/editor/Editor";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PhotoIcon} from "@heroicons/react/24/solid";
import CreatableSelect from "react-select/creatable";

// hooks
import {toast} from "@/hooks/use-toast";

// validator and types
import {zodResolver} from "@hookform/resolvers/zod";

// api
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {TagPayload} from "@/lib/validators/blog/tag";
import {BlogPayload, BlogValidator} from "@/lib/validators/blog/blog";
import {generateSlug} from "@/lib/slugtify";
import {Blog, Tag} from "@prisma/client";

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

type Props = {
  tags: Tag[];
  defaultValues?: Blog & {
    tags: Tag[];
  };
};

type Option = {
  label: string;
  value: string;
  __isNew__: boolean;
};

const BlogForm = ({tags, defaultValues}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [fileURL, setFileURL] = useState<string | undefined>(
    defaultValues?.coverImage
  );
  const [file, setFile] = useState<File | undefined>();
  const [sneakers, setSneakers] = useState<Array<CloudinaryResource>>();
  const [selectValue, setSelectValue] = useState<Option[] | undefined>(
    defaultValues?.tags.map((tag) => ({
      value: tag.id.toString(),
      label: tag.name,
      __isNew__: false,
    }))
  );

  const form = useForm<BlogPayload>({
    resolver: zodResolver(BlogValidator),
    defaultValues: {
      content: defaultValues?.content,
      coverImage: defaultValues?.coverImage,
      title: defaultValues?.title,
      tagIds: defaultValues?.tags.map((t) => t.id),
    },
  });

  const options: Option[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
    __isNew__: false,
  }));

  const handleTagData = () => {
    const tagIds = selectValue?.map((tag) => Number(tag.value));

    return tagIds;
  };

  const createBlogPost = async (payload: BlogPayload) => {
    try {
      const imageUrl = await handleImageSubmit();
      const tagIds = await handleTagData();

      const updatedPayload = {
        ...payload,
        coverImage: imageUrl,
        tagIds: tagIds,
      };

      const {data} = await axios.post("/api/blog", updatedPayload);
      return data;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  };

  const updateBlogPost = async (payload: BlogPayload) => {
    const imageUrl = await handleImageSubmit();
    const tagIds = await handleTagData();

    const updatedPayload = {
      ...payload,
      coverImage: imageUrl == undefined ? payload.coverImage : imageUrl,
      tagIds: tagIds,
    };

    const {data} = await axios.patch(
      `/api/blog/${defaultValues?.slug}`,
      updatedPayload
    );
    return data;
  };

  const createTagData = async (payload: TagPayload) => {
    const {data, status} = await axios.post("/api/blog/tag", payload);
    if (status === 200) {
      const select = selectValue?.find((f) => f.value === data.tag.name);

      if (select) {
        select.__isNew__ = false;
        select.value = data.tag.id;
      }
    }

    return data.tag;
  };

  const {mutate: createBlog, isPending} = useMutation({
    mutationFn: async (values: BlogPayload) => createBlogPost(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: `${err}`,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/admin/blog`);
        router.refresh();
      }, 1000);
    },
  });

  const {mutate: UpdateBlog, isPending: isPendingUpdate} = useMutation({
    mutationFn: async (values: BlogPayload) => updateBlogPost(values),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: `${err}`,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/admin/blog`);
        router.refresh();
      }, 1000);
    },
  });

  const {mutate: createTag} = useMutation({
    mutationFn: async (values: TagPayload) => createTagData(values),
  });

  const handleNewTag = async (payload: TagPayload) => {
    await createTag(payload);
  };

  const handleSelectChange = (selectOptions: any) => {
    setSelectValue(selectOptions);
    selectOptions?.forEach((option: any) => {
      if (option.__isNew__) {
        let payload: TagPayload = {
          name: option.label,
        };
        handleNewTag(payload);
      }
    });
    form.setValue("tagIds", []);
  };

  async function handleImageSubmit() {
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
      form.setValue("coverImage", "");
      setFile(uploadedFile);
      setFileURL(URL.createObjectURL(uploadedFile));
    }
  };

  const onSubmit = async (data: BlogPayload) => {
    if (pathname.includes("edit")) {
      await UpdateBlog(data);
    } else {
      await createBlog(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-8">
        <div className="">
          <label
            htmlFor="cover-image"
            className="block text-sm font-medium text-gray-900"
          >
            Cover Image
          </label>
          <div className="mt-2 flex justify-center rounded-md border border-dashed border-gray-900/25 h-64">
            <div className="mt-4 flex text-sm leading-6 text-gray-600 items-center justify-center">
              <label
                htmlFor="coverImage"
                className="relative text-center cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                {fileURL ? (
                  <img
                    src={fileURL}
                    alt="img"
                    className="object-contain h-48 w-96 "
                  />
                ) : (
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({field}) => (
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
        <div className="md:grid md:grid-cols-2 gap-8 py-8">
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagIds"
            render={({field}) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <CreatableSelect
                    isClearable
                    isMulti
                    onChange={handleSelectChange}
                    options={options}
                    value={selectValue}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
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

export default BlogForm;
