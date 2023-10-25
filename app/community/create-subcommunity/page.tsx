"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { generateSlug } from "@/lib/slugtify";
import { CreateSubCommunityPayload } from "@/lib/validators/subCommunitySubscription";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const { loginToast } = useCustomToasts();

  const { mutate: createCommunity, isPending } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubCommunityPayload = {
        creatorId: session?.user.id,
        name: input,
      };
      const { data } = await axios.post("/api/subcommunity", payload);
      console.log("data", data);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
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
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/community/${generateSlug(data)}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto py-12">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-gray-400 h-px" />

        <div>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              d/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
