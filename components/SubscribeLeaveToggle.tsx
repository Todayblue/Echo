"use client";
import { Button } from "@/components/ui/button";
import { SubscribeToSubCommunityPayload } from "@/lib/validators/subCommunitySubscription";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useToast } from "../hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useSession } from "next-auth/react";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subCommunityId: string;
  subcommunityName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subCommunityId,
  subcommunityName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToasts();
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubCommunityPayload = {
        subCommunityId,
        userId: session?.user.id,
      };

      const { data } = await axios.post("/api/subcommunity/subscribe", payload);
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
        description: `You are now subscribed to r/${subcommunityName}`,
      });
    },
  });

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubCommunityPayload = {
        subCommunityId,
        userId: session?.user.id,
      };

      const { data } = await axios.post(
        "/api/subcommunity/unsubscribe",
        payload
      );
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
        description: `You are now unsubscribed from/${subcommunityName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="mt-1 mb-4 rounded-3xl w-20 h-8 "
      variant="default"
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave
    </Button>
  ) : (
    <Button
      className="mt-1 mb-4 rounded-3xl w-20 h-8 "
      variant="default"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join
    </Button>
  );
};

export default SubscribeLeaveToggle;
