"use client";
import { Button } from "@/components/ui/button";
import { SubscribeToCommunityPayload } from "@/lib/validators/communitySubscription";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {useRouter} from "next/navigation";
import { startTransition } from "react";
import { useToast } from "../hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useSession } from "next-auth/react";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  communityId: string;
  communityName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  communityId,
  communityName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToasts();
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };

      const { data } = await axios.post("/api/community/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${communityName}`,
      });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };

      const { data } = await axios.post("/api/community/unsubscribe", payload);
      return data as string;
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Error",
        description: err.response?.data as string,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from/${communityName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="mt-5 mb-4 rounded-3xl w-20 h-8 "
      variant="default"
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave
    </Button>
  ) : (
    <Button
      className="mt-5 mb-4 rounded-3xl w-20 h-8 "
      variant="default"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join
    </Button>
  );
};

export default SubscribeLeaveToggle;
