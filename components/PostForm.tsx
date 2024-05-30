"use client";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Image from "next/image";
import {UploadDropzone} from "@/components/Uploadthing";
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {PostCreationRequest, PostValidator} from "@/lib/validators/post";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Editor from "@/components/editor/Editor";
import {Button} from "@/components/ui/button";
import Select from "react-select";

// hooks
import {toast} from "@/hooks/use-toast";

// api
import {useMutation, useQuery} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {useRouter} from "next/navigation";

import {MapPin} from "lucide-react";
import {DropdownOption} from "@/types/common";
import {GetCommunityDDL, createSubCommuPost} from "@/services/community";

type Props = {
  setCommunityId: (vaule: string) => void;
  setIsDefault?: (vaule: boolean) => void;
  defaultCommunityDDL?: DropdownOption;
};

const PostForm = ({
  setCommunityId,
  defaultCommunityDDL,
  setIsDefault,
}: Props) => {
  const router = useRouter();

  const [media, setMedia] = useState<any>(null);
  const [selected, setSelected] = useState<DropdownOption | null>(
    defaultCommunityDDL || null
  );
  const [check, setCheck] = useState<boolean>(false);

  const form = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId: defaultCommunityDDL?.value,
    },
  });

  const {isPending: ddlPending, data: communityDDL} = useQuery({
    queryKey: ["communityDDL"],
    queryFn: () => GetCommunityDDL(),
  });

  const handleSelectChange = (selectOptions: any) => {
    if (setIsDefault) {
      setIsDefault(false);
    }
    setCommunityId(selectOptions.value);
    form.setValue("communityId", selectOptions.value);
    setSelected(selectOptions);
  };

  const handleUploadComplete = (res: any) => {
    res[0].type.includes("image")
      ? form.setValue("imageUrl", res[0].url)
      : form.setValue("videoUrl", res[0].url);
    setMedia(res[0]);
  };

  const {mutate: createCommunityPost, isPending} = useMutation({
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
        if (err.response?.status === 401) {
          // return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create post",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${data.communitySlug}`);
        router.refresh();
      }, 1000);
    },
  });

  const onSubmit = async (data: PostCreationRequest) => {
    await createCommunityPost(data);
  };

  const onVeiwMap = () => {
    const latLongRegex =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

    const latLongValue = form.getValues("latlong") || "";

    const isValidFormat = latLongRegex.test(latLongValue);

    let googleMapsUrl: string;
    if (isValidFormat) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLongValue?.split(",")[0]},${latLongValue?.split(",")[1]}`;
    } else {
      googleMapsUrl = "https://www.google.com/maps/";
    }
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">
              <p>Post</p>
            </TabsTrigger>
            <TabsTrigger value="image">Image & Video</TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <div className="flex justify-between">
              <div className="grid w-[50%] mt-2">
                <FormField
                  control={form.control}
                  name="communityId"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={selected}
                          onChange={handleSelectChange}
                          options={communityDDL}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "white",
                              primary: "black",
                            },
                          })}
                          placeholder="Choose a community"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center ">
                <MapPin
                  onClick={() => setCheck(!check)}
                  className="hover:cursor-pointer"
                />
              </div>
            </div>
            <Card className="mx-auto px-6 mt-4">
              <div className="grid gap-6 pt-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  {/* <Label>Text </Label> */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({field}) => (
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
                {check && (
                  <div className="grid gap-2">
                    <div className="flex flex-row justify-between">
                      <Label>Latitude Longitude</Label>
                      <p
                        className="text-bold text-gray-700 text-sm hover:underline hover:cursor-pointer"
                        onClick={onVeiwMap}
                      >
                        view map
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="latlong"
                      render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              <CardFooter className="flex justify-end px-0 pt-4">
                <div className="flex justify-between space-x-2">
                  <Button
                    type="button"
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isPending}
                    type="submit"
                    size={"sm"}
                    disabled={selected === null}
                  >
                    Post
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="image">
            <div className="grid w-[50%] my-4">
              <Select
                value={selected}
                onChange={handleSelectChange}
                options={communityDDL}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "white",
                    primary: "black",
                  },
                })}
                placeholder="Choose a community"
              />
            </div>
            <Card className="">
              <div className="grid gap-2 px-6 pt-4">
                <Label>Title</Label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardHeader>
                {media === null && (
                  <UploadDropzone
                    className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                    endpoint="mediaPost"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error: Error) => {
                      alert(`Error ${error}`);
                    }}
                  />
                )}
                {media !== null && (
                  <>
                    {media.type.includes("image") ? (
                      <Image
                        src={media.url}
                        alt="uploaded image"
                        width={500}
                        height={400}
                        className="h-80 rounded-lg w-full object-contain"
                      />
                    ) : (
                      <video
                        className="h-80 rounded-lg w-full object-contain"
                        controls
                        preload="true"
                      >
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </>
                )}
              </CardHeader>
              <CardFooter className="flex justify-end ">
                <div className="flex justify-between space-x-2">
                  <Button
                    type="button"
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isPending}
                    disabled={selected === null}
                    size={"sm"}
                  >
                    Post
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default PostForm;
